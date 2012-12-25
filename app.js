var config = require('./config.js')
  , wbp = require('wbpjs');

wbp.configure(config);
wbp.create();

var ws = require(config.baseDir + '/lib/ws.js');
ws.listen();

wbp.start();
