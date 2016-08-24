'use strict';

const cheerio = require('cheerio');
const babylon = require('babylon');
const Traverse = require('babel-traverse').default;
const generator = require('babel-generator').default;
const Types = require('babel-types');
const reactTemplates = require('react-templates/src/reactTemplates');
const hash = require('hash-sum');
const CACHE = {};

function parseComponent(content, filename) {
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

    // TODO check template and script tag length

    CACHE[cacheKey] = {
      template: {
        content: $template.html()
      },
      script: {
        content: $script.html()
      },
      style: {
        content: $style.html(),
        lang: $style.attr('lang') || 'css'
      }
    };
  }

  return CACHE[cacheKey];
};

function parse(content, filename) {
  const comResults = parseComponent(content, filename);

  const react = convertTemplateToReact(comResults.template.content);
  const script = insertReactToScript(comResults.script.content, react);

  const results = {};
  results.js = script;
  results[comResults.style.lang] = comResults.style.content;

  return results;
}

function convertTemplateToReact(template) {
  return reactTemplates.convertTemplateToReact(template, { modules: 'jsrt' });
}

function insertReactToScript(script, react) {
  const ast = parse2AST(script);
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

function parse2AST(content) {
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

exports.parseComponent = parseComponent;
exports.parse = parse;
