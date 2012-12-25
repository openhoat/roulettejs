var wbp = require('wbpjs')
  , config = wbp.config
  , io
  , User = require(config.baseDir + '/models/user.js');

var verbose = config.options && config.options.verbose;

function getIpFromSocket(socket) {
  var xForwardedFor = socket.handshake.headers['x-forwarded-for'];
  if (xForwardedFor !== undefined) {
    return xForwardedFor.split(',')[0];
  } else {
    return socket.handshake.address.address;
  }
}

function findClient(id) {
  var clients = io.sockets.clients();
  for (var i = 0; i < clients.length; i++) {
    var client = clients[i];
    if (client.id === id) {
      return client;
    }
  }
  return null;
}

var wsServer = {
  listen:function () {
    verbose && console.log('start listening web sockets');
    io = require('socket.io').listen(wbp.server, { log:false });
    io.sockets.on('connection', function (socket) {
      var user = User.join(socket.id);
      user.address = getIpFromSocket(socket);
      verbose && console.log('accept new user :', user);
      io.sockets.emit('users', User.list());
      socket.on('disconnect', function () {
        verbose && console.log('disconnecting :', socket.id);
        User.remove(socket.id);
        io.sockets.emit('users', User.list());
      });
      socket.on('nickname', function (nickname) {
        user.nickname = nickname;
        io.sockets.emit('users', User.list());
      });
      socket.on('join', function (id) {
        user.setTarget(id);
        io.sockets.emit('users', User.list());
      });
      socket.on('next', function () {
        user.setFirstFreeTarget();
        io.sockets.emit('users', User.list());
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
  }
};

module.exports = wsServer;
