var hwLogger = require('hw-logger')
  , HwExpress = require('hw-express')
  , WsServer = require('./lib/ws-server')
  , hwe, wsServer;

hwe = new HwExpress({
  'express': require('express'),
  'ejs': require('ejs'),
  'less-middleware': require('less-middleware'),
  'hw-logger': hwLogger
});

if (process.env['NODE_ENV'] === 'production') {
  hwLogger.stream = process.stdout;
}

hwe.start();

wsServer = new WsServer(hwe);
wsServer.start();
