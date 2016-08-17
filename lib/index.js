'use strict'

var selectorPath = require.resolve('./selector');
var loaderUtils = require('loader-utils');
var parser = require('./parser');
var path = require('path');
var util = require('./util');

module.exports = function(content){
    var filePath = this.resourcePath,
        loaderContext = this.context,
        output = `var __seek__script = ${util.getRequire('script', filePath, loaderContext)};  module.exports = __seek__script; __seek__script.default = __seek__script;`;

    this.callback(null, output, null);
}

