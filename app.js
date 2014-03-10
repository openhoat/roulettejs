var HwExpress = require('hw-express')
  , WsServer = require('./lib/ws-server')
  , hwe, wsServer;

hwe = new HwExpress();
hwe.start();
wsServer = new WsServer(hwe);
wsServer.start();

