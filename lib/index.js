'use strict';
const request = require('./request');
const xlsx = require('node-xlsx').default;
const fs = require('fs');
const path = require('path');

class QQSheet {
  constructor(sheetUrl, options = {}) {
    /**
     * 对qq在线表格，裁剪掉？后的参数，以避免参数错误，tab中包含tab参数，如果对应tab被删除
     * 访问会出问题。去掉参数，默认从第一个tab开始。
     */
    this.sheetUrl = sheetUrl.split('?')[0];
    /**
     * t=1564650062254 时间戳
     * preview_token='' 初始化时无
     * id=BqI21X2yZIht... 页面url上的path值
     * outformat=1&normal=1&
     * tab=r6q704 如果初始化在其他tab
     * @type {string}
     */
    this.initPath = 'https://docs.qq.com/dop-api/opendoc?';
    this.id = this.sheetUrl.split('/').pop();
    /**
     * xsrf=b6a25e7e0c11fd7c 安全校验，初始化接口返回
     * subId=4q4x31 该tab的id
     * padId=144115210548018620$p5ae01cee21ac74af940430fb01a388b7 初始化接口有返回
     * @type {string}
     */
    // this.apiPath = 'https://docs.qq.com/dop-api/get/sheet?';
    // sheet tab列表。
    this.header = null;
    this.options = options;
  }

  /**
   * 所有tab的请求都以初始化方式。第一个不需要sheetid，后续几个需要。
   * @param {string} tabId 当前sheetid值
   * @return {string} http接口地址
   */
  getInitUrl(tabId) {
    const initUrl = `${this.initPath}outformat=1&normal=1&preview_token=&t=${+new Date()}&id=${this.id}`;
    if (tabId) {
      return `${initUrl}&tab=${tabId}`;
    }
    return initUrl;
  }

  /**
   *
   * @return {Promise<*>} 文件地址或者表格数据
   */
  async parse() {
    let res = [];
    try {
      // 获取第一个sheet，此过程可以拿到header列表。
      res[0] = await this.getOneSheetRes(this.getInitUrl());
    } catch (err) {
      console.error(err);
      return false;
    }
    // 获取其他sheet数据。
    for (let i = 1, len = this.header.length; i < len; i += 1) {
      res[i] = await this.getOneSheetRes(this.getInitUrl(this.header[i].id));
    }
    // res为所有sheet组成的列表。每项都是一个接口响应数据。需进一步提取。

    try {
      res = QQSheet.extract(res);
    } catch (err) {
      console.error('接口数据结构异常！对方数据结构可能有变动');
      return false;
    }
    const resultData = [];
    for (let i = 0, len = this.header.length; i < len; i += 1) {
      resultData[i] = {
        name: this.header[i].name,
        data: res[i],
      };
    }

    // 生成文件到指定地方
    if (this.options.filepath) {
      const buffer = xlsx.build(resultData);
      const filepathAbs = path.resolve(this.options.filepath);
      fs.writeFileSync(filepathAbs, buffer);
      return filepathAbs;
    }
    return resultData;
  }

  /**
   * 输入所有sheet tab的接口响应回的数据，过滤掉其他结构。
   * [
   *   [
   *     [1,2,3],
   *     [a,b,c]
   *   ]
   * ]
   * @param {object} arrData 各个接口返回的原始接口数据集合。
   * @return {object} 处理后的只带有表格内数据的集合
   */
  static extract(arrData) {
    const extractData = [];
    for (let i = 0, len = arrData.length; i < len; i += 1) {
      const kData = arrData[i].clientVars.collab_client_vars.initialAttributedText.text[0][0].u[0].k;

      // 该sheet的data数据，未整理前
      const oneSheetDataFull = JSON.parse(kData)[1][0][1][2][2];
      // 该sheet的data数据，整理后：[[1,2,3],[a,b,c]]
      const onesheetData = [];
      extractData.push(onesheetData);

      for (let j = 1, jlen = oneSheetDataFull.length; j < jlen; j += 2) {
        // 该sheet某一行数据，未整理前
        const oneRowDataFull = oneSheetDataFull[j];
        // 该sheet某一行数据，整理后：
        const oneRowData = [];
        onesheetData.push(oneRowData);

        for (let k = 1, klen = oneRowDataFull.length; k < klen; k += 2) {
          oneRowData.push(oneRowDataFull[k][1][1][1][1][1]);
        }
      }
    }

    return extractData;
  }
  async getOneSheetRes(url) {
    // console.log('request qq sheet interface url: ', url);
    let res = '';
    try {
      res = await request(url);
      res = JSON.parse(res);
    } catch (err) {
      console.error('请求数据有异常，非json string，无法parse');
    }
    this.header = this.header || res.clientVars.collab_client_vars.header[0].d;
    return res;
  }
}

module.exports = QQSheet;
