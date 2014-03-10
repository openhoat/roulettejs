var app = angular.module('RouletteApp', []);

app.factory('socket', function ($rootScope) {
  var socket = io.connect(window.location.origin);
  console.log('socket :', socket);
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

app.controller('RouletteCtrl', function ($scope, socket) {
  var targetCam = $('#targetCam')
    , targetCamElt = targetCam.get(0)
    , selfCam = $('#selfCam')
    , selfCamElt = selfCam.get(0)
    , canvas = $('<canvas />')
    , canvasElt = canvas.get(0)
    , ctx = canvasElt.getContext('2d')
    , timer;

  canvasElt.width = selfCam.width();
  canvasElt.height = selfCam.height();

  $scope.user = {};
  $scope.users = [];
  $scope.messages = [];
  $scope.targetCamStatus = i18n('waiting');

  function showMessage(message) {
    $scope.messages.push(message);
    setTimeout(function () {
      for (var i = 0; i < $scope.messages.length; i++) {
        if ($scope.messages[i] === message) {
          $scope.$apply(function () {
            $scope.messages.splice(i, 1);
          });
          return true;
        }
      }
      return false;
    }, 3000);
  }

  $scope.changeNickname = function () {
    socket.emit('nickname', $scope.user.nickname);
    createCookie('nickname', $scope.user.nickname, 10000);
    showMessage(i18n('You are now known as') + ' ' + $scope.user.nickname);
  };

  $scope.join = function (id) {
    if (id === $scope.user.target) {
      socket.emit('leave');
      $scope.targetCamStatus = i18n('waiting');
    } else {
      socket.emit('join', id);
      $scope.targetCamStatus = i18n('connecting');
    }
  };

  selfCam.after(canvas);
  canvas.hide();

  $('#nextButton').click(function (e) {
    e.preventDefault();
    socket.emit('next');
    $scope.targetCamStatus = i18n('searching');
  });

  socket.on('connect', function () {
    $scope.userId = this.socket.sessionid;
    var nickname = readCookie('nickname');
    if (nickname !== null) {
      socket.emit('nickname', nickname);
    }
    socket.on('users', function (users) {
      $scope.users.length = 0;
      for (var i = 0; i < users.length; i++) {
        if (users[i].id === $scope.userId) {
          $scope.user = users[i];
          if (users[i].target == null) {
            targetCamElt.src = '/assets/img/static.gif';
            $scope.targetCamStatus = i18n('waiting');
          } else {
            $scope.targetCamStatus = i18n('connected');
          }
        } else {
          $scope.users.push(users[i]);
        }
      }
    });
    socket.on('stream', function (data) {
      var url = data;
      targetCamElt.onload = function () {
        window.webkitURL.revokeObjectURL(url);
      };
      targetCamElt.src = url;
    });
  });

  if (navigator.webkitGetUserMedia === undefined) {
    showMessage(i18n('Browser not compatible !'));
  } else {
    navigator.webkitGetUserMedia({video: true}, function (stream) {
      selfCamElt.src = window.webkitURL.createObjectURL(stream);
    }, function (err) {
      $scope.$apply(function () {
        showMessage(i18n('Error with cam !'));
      });
    });
  }

  timer = setInterval(function () {
    if (selfCamElt.src !== '' && $scope.user.target !== null) {
      ctx.drawImage(selfCamElt, 0, 0, selfCam.width(), selfCam.height());
      var data = canvasElt.toDataURL('image/jpeg', 1.0);
      socket.emit('stream', data);
    }
  }, 500);
});

function createCookie(name, value, days) {
  var expires = '';
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toGMTString();
  }
  document.cookie = name + '=' + value + expires + '; path=/';
}

function readCookie(name) {
  var prefix = name + "=";
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(prefix) == 0) {
      return cookie.substring(prefix.length, cookie.length);
    }
  }
  return null;
}

function deleteCookie(name) {
  createCookie(name, '', -1);
}