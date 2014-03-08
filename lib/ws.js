var pkg = require('../package')
  , wbp = require('wbpjs').getInstance(pkg.name)
  , config = wbp.requireAppFile('config')
  , wsServer = wbp.getWebSocketsServer()
  , User = wbp.requireAppFile('models', 'user');

function getIpFromSocket(socket) {
  var xForwardedFor = socket.handshake.headers['x-forwarded-for'];
  return xForwardedFor === undefined ? socket.handshake.address.address : xForwardedFor.split(',')[0];
}

function findClient(id) {
  var i, client, clients = wsServer.sockets.clients();
  for (i = 0; i < clients.length; i++) {
    client = clients[i];
    if (client.id === id) {
      return client;
    }
  }
  return null;
}

wsServer.sockets.on('connection', function (socket) {
  var user = User.join(socket.id);
  user.address = getIpFromSocket(socket);
  wbp.log('accept new user :', user);
  wsServer.sockets.emit('users', User.list());
  socket.on('disconnect', function () {
    wbp.log('disconnecting :', socket.id);
    User.remove(socket.id);
    wsServer.sockets.emit('users', User.list());
  });
  socket.on('nickname', function (nickname) {
    user.nickname = nickname;
    wsServer.sockets.emit('users', User.list());
  });
  socket.on('join', function (id) {
    user.setTarget(id);
    wsServer.sockets.emit('users', User.list());
  });
  socket.on('leave', function () {
    user.setTarget(null);
    wsServer.sockets.emit('users', User.list());
  });
  socket.on('next', function () {
    user.setFirstFreeTarget();
    wsServer.sockets.emit('users', User.list());
  });
  socket.on('stream', function (data) {
    if (user.target !== null) {
      var client = findClient(user.target);
      if (client !== null) {
        client.emit('stream', data);
      }
    }
  });
});

module.exports = wsServer;
