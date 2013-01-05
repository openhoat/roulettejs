var wbp = require('wbpjs')
  , config = wbp.requireAppFile('config');

wbp.start(config, function(){
  wbp.requireAppFile('lib', 'ws');
});