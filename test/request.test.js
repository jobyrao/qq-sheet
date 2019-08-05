'use strict';

const chai = require('chai');
const request = require('../lib/request');

const expect = chai.expect;
// 测试文档地址
// 'https://docs.qq.com/sheet/BqI21X2yZIht1487cQ1mHxFy1TyDtE4E6MIS0zk6GT2sYPhU2IQmKC2Cjyb92FLz9g0PQHVH22S2IO11cq4u0';
// 测试文档的唯一id
const id = 'BqI21X2yZIht1487cQ1mHxFy1TyDtE4E6MIS0zk6GT2sYPhU2IQmKC2Cjyb92FLz9g0PQHVH22S2IO11cq4u0';
// 访问qq sheet数据的接口有2种，一种是初始化，一种是后续操作。本库使用初始化方式。
const url = `http://docs.qq.com/dop-api/opendoc?t=${+new Date()}&id=${id}&outformat=1&normal=1&preview_token=`;
// 测试文档第三个sheet id
const tabId = '4q4x31';

describe('qq sheet接口请求测试', function() {
  it('接口请求：错误url地址检验', function(done) {
    request(url.slice(3))
      .then(() => {
        expect(true).to.be.equal(false);
        done();
      })
      .catch(err => {
        expect(err.message).to.be.an('string');
        done();
      });
  });
  it('接口请求：错误qq sheet url地址检验', function(done) {
    request(url.replace('.qq.', '.qqqxxx.'))
      .then(() => {
        expect(true).to.be.equal(false);
        done();
      })
      .catch(err => {
        expect(err.message).to.be.an('string');
        done();
      });
  });
  it('接口请求：初始化方式 无tabId参数（即默认第一个sheet）', function(done) {
    request(url)
      .then(res => {
        let resData;
        try {
          resData = JSON.parse(res);
        } catch (err) {
          resData = {};
        }
        expect(resData.clientVars).to.be.an('object');
        expect(resData.padType).to.be.equal('sheet');
        done();
      })
      .catch(() => {
        expect(true).to.be.equal(false);
        done();
      });
  });
  it('接口请求：初始化方式 有tabId参数（即指定某sheet）', function(done) {
    const url2 = `${url}&tab=${tabId}`;
    request(url2)
      .then(res => {
        let resData;
        try {
          resData = JSON.parse(res);
        } catch (err) {
          resData = {};
        }
        expect(resData.clientVars).to.be.an('object');
        expect(resData.padType).to.be.equal('sheet');
        done();
      })
      .catch(() => {
        expect(true).to.be.equal(false);
        done();
      });
  });
});
