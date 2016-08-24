'use strict';

const loaderUtils = require('loader-utils');
const selectorPath = require.resolve('./selector');

function getRequire(type, filePath, loaderContext) {
  return `require(${getRequireString(type, filePath, loaderContext)})`;
}

function getRequireString(type, filePath, loaderContext) {
  return loaderUtils.stringifyRequest(loaderContext, `!!${getLoaderString(type)}!${getSelectorString(type)}!${filePath}`);
}

function getLoaderString(type) {
  switch (type) {
    case 'script': {
      const query = {
        cacheDirectory: true,
        compact: false,
        presets: [
          'babel-preset-es2015',
          'babel-preset-react',
          'babel-preset-stage-0'
        ].map(require.resolve),
        plugins: [
          require.resolve('babel-plugin-transform-decorators-legacy'),
          require.resolve('babel-plugin-add-module-exports'),
          // [require.resolve('babel-plugin-antd'), { libraryName: '@alife/next' }]
        ]
      };

      return `babel-loader?${JSON.stringify(query)}`;
    }
    case 'style':
      return 'style!@ali/ali-css-loader!@ali/sass-loader?sourceMap';
    default:
      throw new Error(`unknown type: ${type}`);
  }
}

function getSelectorString(type) {
  return `${selectorPath}?type=${type}`;
}

exports.getRequire = getRequire;
