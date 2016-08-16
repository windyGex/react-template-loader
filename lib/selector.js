var loaderUtils = require('loader-utils');
var parser = require('./parser');
var path = require('path');

module.exports = function(content){
    this.cacheable()
    var query = loaderUtils.parseQuery(this.query)
    var filename = path.basename(this.resourcePath)
    var output = parser(content, filename, this.sourceMap)
    var part = output[query.type]
    this.callback(null, part.content);
}