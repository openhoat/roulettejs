var pkg = require('./package')
  , wbp = require('wbpjs').getInstance(pkg.name)
  , config = wbp.requireAppFile('config');

wbp.start(config, function(){
  wbp.requireAppFile('lib', 'ws');
});