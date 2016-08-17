'use strict'

var loaderUtils = require('loader-utils');
var selectorPath = require.resolve('./selector');

function getRequire(type, filePath, loaderContext){
    return `require(${getRequireString(type, filePath, loaderContext)})`;
}

function getRequireString(type, filePath, loaderContext){
    return loaderUtils.stringifyRequest(loaderContext, `!!${getLoaderString(type)}!${getSelectorString(type)}!${filePath}`);
}

function getLoaderString(type){
    if(type == 'template'){
        return 'react-templates-loader?modules=commonjs'
    }else{
        return 'babel-loader?presets[]=es2015&presets[]=stage-0&presets[]=react&plugins[]=transform-decorators-legacy&plugins[]=add-module-exports&comments=false'
    }
}

function getSelectorString(type){
    return `${selectorPath}?type=${type}`
}

exports.getRequire  = getRequire;