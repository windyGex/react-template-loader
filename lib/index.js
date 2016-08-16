'use strict'

var selectorPath = require.resolve('./selector');
var loaderUtils = require('loader-utils');
var defaultLoaders = {
    template: 'react-template-loader',
    script: 'babel-loader?presets[]=es2015&plugins[]=transform-runtime&comments=false'
}

module.exports = function(content){
    var output = 'var __seek__template, __seek__script',
        filePath = this.resourcePath,
        loaderContext = this.loaderContext;

    output += `__seek__template = ${getRequire(type, filePath, loaderContext)}`;
    output += `__seek__script = ${getRequire(type, filePath, loaderContext)}`;
    output += `module.exports = __seek__script`;
}

function getRequire(type, filePath, loaderContext){
    return `require(${getRequireString(type, filePath, loaderContext)})`;
}

function getRequireString(type, filePath, loaderContext){
    return `${loaderUtils.stringifyRequest(loaderContext)}!${getLoaderString(type)}!${getSelectorString(type)}${filePath}}`
}

function getLoaderString(type){
    if(type == 'template'){
        return 'react-template-loader'
    }else{
        return 'babel-loader?presets[]=es2015&plugins[]=transform-runtime&comments=false'
    }
}

function getSelectorString(type){
    return `${selectorPath}?type=${type}`
}