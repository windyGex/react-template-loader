'use strict';

const path = require('path');
const loaderUtils = require('loader-utils');
const parser = require('./parser');

module.exports = function(content) {
  this.cacheable();

  const query = loaderUtils.parseQuery(this.query);
  const filename = path.basename(this.resourcePath);
  const output = parser(content, filename);

  this.callback(null, output[query.type]);
};
