var wbp = require('wbpjs')
  , config = require(wbp.findAppFile('config.js'));

wbp.start(config, function(){
  require(wbp.findAppFile('lib', 'ws.js'));
});