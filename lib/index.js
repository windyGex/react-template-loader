'use strict'

var selectorPath = require.resolve('./selector');
var loaderUtils = require('loader-utils');
var defaultLoaders = {
    template: 'react-template-loader?module=none',
    script: 'babel-loader?presets[]=es2015&plugins[]=transform-runtime&comments=false'
}

module.exports = function(content){
    var output = 'var __seek__template, __seek__script;\n',
        filePath = this.resourcePath,
        loaderContext = this.context;


    output += `__seek__template = ${getRequire('template', filePath, loaderContext)};\n`;
    output += `__seek__script = ${getRequire('script', filePath, loaderContext)};\n`;
    output += `__seek__script.render = __seek__template; \n`;
    output += `module.exports = __seek__script;`;
    console.log(output);
    this.callback(null, output, null);
}

function getRequire(type, filePath, loaderContext){
    return `require(${getRequireString(type, filePath, loaderContext)})`;
}

function getRequireString(type, filePath, loaderContext){
    return loaderUtils.stringifyRequest(loaderContext, `!!${getLoaderString(type)}!${getSelectorString(type)}!${filePath}`);
}

function getLoaderString(type){
    if(type == 'template'){
        return 'react-templates-loader'
    }else{
        return 'babel-loader?presets[]=es2015&presets[]=stage-0&presets[]=react&plugins[]=transform-decorators-legacy&plugins[]=add-module-exports&comments=false'
    }
}

function getSelectorString(type){
    return `${selectorPath}?type=${type}`
}