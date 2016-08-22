'use strict'

var loaderUtils = require('loader-utils');
var selectorPath = require.resolve('./selector');
var reactTemplates = require('react-templates/src/reactTemplates');
var qs = require('qs');

function getRequire(type, filePath, loaderContext){
    return `require(${getRequireString(type, filePath, loaderContext)})`;
}

function getRequireString(type, filePath, loaderContext){
    return loaderUtils.stringifyRequest(loaderContext, `!!${getLoaderString(type)}!${getSelectorString(type)}!${filePath}`);
}

function getLoaderString(type){
    var query = {
        cacheDirectory: true,
        compact: false,
        presets: [
          'babel-preset-es2015',
          'babel-preset-react',
          'babel-preset-stage-0'
        ].map(require.resolve),
        plugins: [
          'babel-plugin-transform-decorators-legacy',
          'babel-plugin-add-module-exports',
          // 'babel-plugin-lodash'
        ].map(require.resolve)
    };

    var queryString = qs.stringify(query, { arrayFormat: 'brackets', encode: false });

    return `babel-loader?${queryString}`;
}

function getSelectorString(type){
    return `${selectorPath}?type=${type}`
}

function getContent(source, options){
    var content = reactTemplates.convertTemplateToReact(source, {modules: 'jsrt'});
    return content;
}

exports.getRequire = getRequire;
exports.getContent = getContent;
