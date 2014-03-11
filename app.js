var HwExpress = require('hw-express')
  , WsServer = require('./lib/ws-server')
  , hwe, wsServer;

hwe = new HwExpress({
  'express': require('express'),
  'ejs': require('ejs'),
  'less-middleware': require('less-middleware'),
  'hw-logger': require('hw-logger')
});
hwe.start();
wsServer = new WsServer(hwe);
wsServer.start();