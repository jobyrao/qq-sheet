'use strict';

const http = require('http');
const https = require('https');
const methods = {
  http,
  https,
};

function request(url) {
  return new Promise((resolve, reject) => {
    if (!/^https?:\/\//.test(url)) {
      reject(new Error('Incomplete URL!'));
      return false;
    }
    function requestStart(url) {
      methods[url.split('://')[0]].get(url, callback).on('error', e => {
        // console.error(`https? request error: ${e.message}`);
        reject(e);
      });
    }
    function callback(res) {
      const { statusCode } = res;

      let error;
      if (statusCode === 301 || statusCode === 302) {
        // res.headers.location
        return requestStart(res.headers.location, callback);
      }
      if (statusCode !== 200) {
        error = new Error(`request result error：\n statusCode: ${statusCode}`);
      }
      if (error) {
        // console.error(error.message);
        // Release memory
        res.resume();
        reject(error);
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', chunk => { rawData += chunk; });
      res.on('end', () => {
        resolve(rawData);
      });
    }
    requestStart(url);
  });
}

module.exports = request;
