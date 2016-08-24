'use strict';

const path = require('path');
const util = require('./util');
const parser = require('./parser');

module.exports = function(content) {
  const filePath = this.resourcePath;
  const filename = path.basename(filePath);
  const result = parser(content, filename);
  const loaderContext = this.context;
  let output = `var __seek_script__ = ${util.getRequire('script', filePath, loaderContext)};module.exports = __seek_script__;__seek_script__.default = __seek_script__;`;
  if (result.style) {
    output += util.getRequire('style', filePath, loaderContext);
  }
  this.callback(null, output, null);
};
