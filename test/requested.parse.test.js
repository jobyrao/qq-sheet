'use strict';

const chai = require('chai');
const QQSheet = require('../lib/index');
const path = require('path');
const fs = require('fs');

const expect = chai.expect;
// 在线文档地址
const url = 'https://docs.qq.com/sheet/BqI21X2yZIht1487cQ1mHxFy1TyDtE4E6MIS0zk6GT2sYPhU2IQmKC2Cjyb92FLz9g0PQHVH22S2IO11cq4u0';
const qqSheet = new QQSheet(url);

describe('qq sheet数据解析测试', function() {
  let promise;
  it('数据解析：sheet个数完整', function(done) {
    if (!promise) {
      promise = qqSheet.parse();
    }
    promise
      .then(resData => {
        // 检测sheet个数
        expect(resData.length).to.be.equal(3);
        done();
      })
      .catch(() => {
        expect(true).to.be.equal(false);
        done();
      });
  });
  it('数据解析：sheet数据结构完整', function(done) {
    if (!promise) {
      promise = qqSheet.parse();
    }
    promise
      .then(resData => {
        expect(resData[0].name).to.be.an('string');
        // 检查表格第三个sheet 第一列数据
        expect(resData[2].data[0][0]).to.be.equal('title_sheet3');
        expect(resData[2].data[1][0]).to.be.equal('sheet_list[]');
        expect(resData[2].data[2][0]).to.be.equal('sheet_list[]');
        done();
      })
      .catch(() => {
        expect(true).to.be.equal(false);
        done();
      });
  });
  it('数据解析：生成xlsx文件', function(done) {
    const filepath = path.resolve('./test/test.xlsx');
    const qqSheet = new QQSheet(url, { filepath });
    qqSheet.parse()
      .then(xlsxPath => {
        // 检测sheet个数
        expect(xlsxPath).to.be.an('string');
        expect(fs.existsSync(filepath)).to.be.equal(true);
        fs.unlinkSync(filepath);
        done();
      })
      .catch(() => {
        expect(true).to.be.equal(false);
        done();
      });
  });
});
