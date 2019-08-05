# qq-sheet

[![build status](http://img.shields.io/travis/diyao/qq-sheet/master.svg?style=flat)](http://travis-ci.org/diyao/qq-sheet)
[![Coverage Status](https://coveralls.io/repos/diyao/qq-sheet/badge.svg?branch=)](https://coveralls.io/r/diyao/qq-sheet?branch=master)
[![npm version](https://img.shields.io/npm/v/qq-sheet.svg?style=flat)](https://www.npmjs.com/package/qq-sheet)
[![license](https://img.shields.io/github/license/diyao/qq-sheet.svg)](https://tldrlegal.com/license/mit-license)

## Install
```bash
$ npm i qq-sheet --save
```
## Usage
```javascript
const QQSheet = require('qq-sheet');
const path = require('path');

const qqSheetUrl = 'https://docs.qq.com/sheet/BqI21X2yZIht1487cQ1mHxFy1TyDtE4E6MIS0zk6GT2sYPhU2IQmKC2Cjyb92FLz9g0PQHVH22S2IO11cq4u0';
// Example 1
// An xlsx file will be generated and the file path will be returned.
const qqSheet1 = new QQSheet(qqSheetUrl, {filepath: path.join(__dirname, 'qqSheet.xlsx')});
const xlsxFilePath = qqSheet1.parse();

// Example 2
// Returns an array in which each item represents a worksheet.
const qqSheet2 = new QQSheet(qqSheetUrl);
const qqSheetData = qqSheet2.parse();
```

## Tips
- Web pages need to be authorized to anonymous users.
- Because anonymous users can't download documents, we use the method of parsing interface data.

## License

[MIT](LICENSE)
