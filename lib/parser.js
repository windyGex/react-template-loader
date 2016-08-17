'use strict'

var cheerio = require('cheerio');
var hash = require('hash-sum');
var CACHE = {};
module.exports = function(content, filename, needMap){
    var cacheKey = hash(filename + content);
    if(CACHE[cacheKey]){
        return CACHE[cacheKey];
    }
    var output = {
        template: '',
        script: ''
    }
    
    var $ = cheerio.load(content,{
            xmlMode: true
        }),
        template = $('Component > template'),
        script = $('Component > script');

    if(template.length > 1 || script.length > 1){
        throw new Error(
            '[react-template-loader] Only one <script> or <template> tag is ' +
            'allowed inside a react component.'
            )
    }
    output.template = {
        content: template.html()
    }
    output.script = {
        content: script.html()
    }
    CACHE[cacheKey] = output;
    return output;
}
