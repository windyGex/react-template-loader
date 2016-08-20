'use strict'

var loaderUtils = require('loader-utils');
var parser = require('./parser');
var path = require('path');
var babylon = require('babylon');
var Traverse = require('babel-traverse').default;
var generator = require('babel-generator').default;
var Types = require('babel-types');
var util = require('./util');

module.exports = function(content){
    this.cacheable()
    var query = loaderUtils.parseQuery(this.query)
    var filePath = this.resourcePath;
    var filename = path.basename(this.resourcePath)
    var output = parser(content, filename, this.sourceMap)
    var part = output[query.type]
    var content = part.content
    var loaderContext = this.context;
    var templatePath
    if(query.type == 'script'){
        templatePath = util.getContent(output.template.content)
        content = process(content, templatePath).code
    }
    this.callback(null, content);
}

function parse(content){
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
function process(script, templatePath){
    var ast = parse(script);
    Traverse(ast, {
        ClassBody: function(path) {
            path.node.body.push(Types.classProperty(Types.identifier('render'), Types.identifier(templatePath), null, []));
        },
        Program: function(path) {
            path.node.body.unshift(Types.importDeclaration([Types.importDefaultSpecifier(Types.identifier('_'))], Types.stringLiteral('lodash')));
        }
    });
    return generator(ast, null, script);
}