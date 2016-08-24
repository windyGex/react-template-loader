'use strict';

const cheerio = require('cheerio');
const babylon = require('babylon');
const Traverse = require('babel-traverse').default;
const generator = require('babel-generator').default;
const Types = require('babel-types');
const reactTemplates = require('react-templates/src/reactTemplates');
const hash = require('hash-sum');
const CACHE = {};

module.exports = function(content, filename) {
  const cacheKey = hash(filename + content);

  if (!CACHE[cacheKey]) {
    const $ = cheerio.load(content, { xmlMode: true });
    const $component = $('SeekComponent');
    const $template = $component.children('template');
    const $script = $component.children('script');
    const $style = $component.children('style');

    if ($template.length > 1 || $script.length > 1 || $style.length > 1) {
      throw new Error('[seek-component-loader] Only one <template> or <script> or <style> tag is allowed inside a seek component.');
    }

    const template = $template.html();
    let script = $script.html();
    const style = $style.html();

    const react = convertTemplateToReact(template);
    script = insertReactToScript(script, react);

    CACHE[cacheKey] = {
      script: script,
      style: style || ''
    };
  }

  return CACHE[cacheKey];
};

function convertTemplateToReact(template) {
  return reactTemplates.convertTemplateToReact(template, { modules: 'jsrt' });
}

function insertReactToScript(script, react) {
  const ast = parse(script);
  Traverse(ast, {
    ClassBody: function(path) {
      path.node.body.push(Types.classProperty(Types.identifier('render'), Types.identifier(react), null, []));
    },
    Program: function(path) {
      path.node.body.unshift(Types.importDeclaration([Types.importDefaultSpecifier(Types.identifier('_'))], Types.stringLiteral('lodash')));
    }
  });
  return generator(ast, null, script).code;
}

function parse(content) {
  return babylon.parse(content, {
    sourceType: 'module',
    plugins: [
      'asyncFunctions',
      'classConstructorCall',
      'jsx',
      'flow',
      'trailingFunctionCommas',
      'doExpressions',
      'objectRestSpread',
      'decorators',
      'classProperties',
      'exportExtensions',
      'exponentiationOperator',
      'asyncGenerators',
      'functionBind',
      'functionSent'
    ]
  });
}
