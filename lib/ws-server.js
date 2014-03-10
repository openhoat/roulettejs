var socketIo = require('socket.io')
  , User = require('../models/user');

function WsServer(hwe) {
  this.hwe = hwe;
}

WsServer.getIpFromSocket = function (socket) {
  var xForwardedFor = socket.handshake.headers['x-forwarded-for'];
  return xForwardedFor === undefined ? socket.handshake.address.address : xForwardedFor.split(',')[0];
};

WsServer.prototype.start = function () {
  var that, logger, httpServer, wsLogger, key;
  that = this;
  logger = that.hwe.getLogger();
  httpServer = that.hwe.getHttpServer();
  wsLogger = {};
  for (key in logger) {
    wsLogger[key] = logger[key];
  }
  wsLogger.info = logger.ws;
  that.server = socketIo.listen(httpServer, { 'logger': wsLogger });
  that.server.sockets.on('connection', function (socket) {
    var user = User.join(socket.id);
    user.address = WsServer.getIpFromSocket(socket);
    logger.ws('accept new user :', user);
    that.server.sockets.emit('users', User.list());
    socket.on('disconnect', function () {
      logger.ws('disconnecting :', socket.id);
      User.remove(socket.id);
      that.server.sockets.emit('users', User.list());
    });
    socket.on('nickname', function (nickname) {
      user.nickname = nickname;
      that.server.sockets.emit('users', User.list());
    });
    socket.on('join', function (id) {
      user.setTarget(id);
      that.server.sockets.emit('users', User.list());
    });
    socket.on('leave', function () {
      user.setTarget(null);
      that.server.sockets.emit('users', User.list());
    });
    socket.on('next', function () {
      user.setFirstFreeTarget();
      that.server.sockets.emit('users', User.list());
    });
    socket.on('stream', function (data) {
      if (user.target !== null) {
        var client = that.findClient(user.target);
        if (client !== null) {
          client.emit('stream', data);
        }
      }
    });
  });
};

WsServer.prototype.findClient = function (id) {
  var that, i, client, clients;
  that = this;
  clients = that.server.sockets.clients();
  for (i = 0; i < clients.length; i++) {
    client = clients[i];
    if (client.id === id) {
      return client;
    }
  }
  return null;
};

module.exports = WsServer;