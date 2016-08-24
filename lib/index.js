'use strict';

const path = require('path');
const loaderUtils = require('loader-utils');
const parser = require('./parser');
const selectorPath = require.resolve('./selector');

module.exports = function(content) {
  const filePath = this.resourcePath;
  const loaderContext = this.context;
  const query = loaderUtils.parseQuery(this.query);

  const filename = path.basename(filePath);
  const result = parser.parseComponent(content, filename);

  let output = `var __seek_script__ = ${getRequire('js', filePath, loaderContext)};module.exports = __seek_script__;__seek_script__.default = __seek_script__;`;
  if (result.style.content) {
    output += getRequire(result.style.lang, filePath, loaderContext);
  }

  this.callback(null, output, null);

  function getRequire(type, filePath, loaderContext) {
    return `require(${getRequireString(type, filePath, loaderContext)})`;
  }

  function getRequireString(type, filePath, loaderContext) {
    return loaderUtils.stringifyRequest(loaderContext, `!!${getLoaderString(type)}!${getSelectorString(type)}!${filePath}`);
  }

  function getLoaderString(type) {
    if (!query || !query.loaders || !query.loaders[type]) {
      throw new Error(`[seek-component-loader] Cannot find the loader to handle the code type: ${type}`);
    }

    return query.loaders[type];
  }

  function getSelectorString(type) {
    return `${selectorPath}?type=${type}`;
  }
};
