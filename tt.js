/**
 * Created by wassim on 14/11/16.
 */
var fs = require('fs');
var lz4 = require('lz4');

var input = fs.readFileSync('test');
var output = lz4.encode(input);

fs.writeFileSync('test.lz4', output);