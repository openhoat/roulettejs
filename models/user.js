var wbp = require('wbpjs');

var users = [];

var User = function (id, nickname) {
  this.id = id;
  this.nickname = nickname;
  this.target = null;
  this.setTarget = function (id) {
    if (this.target !== null) {
      var target = User.find(this.target);
      target.target = null;
      this.target = null;
    }
    if (id !== null) {
      var newTarget = User.find(id);
      newTarget.target = null;
    }
    this.target = newTarget.id;
    newTarget.target = this.id;
    console.log('this :', this);
    console.log('newTarget :', newTarget);
  };
  this.setFirstFreeTarget = function () {
    var rand = Math.round(Math.random() * users.length);
    for (var i = 0; i < users.length; i++) {
      var target = users[(i + rand) % users.length];
      if (target.id !== this.id && target.target === null) {
        this.setTarget(target.id);
        return target;
      }
    }
    return null;
  };
}

User.join = function (id, nickname) {
  if (nickname === undefined) {
    nickname = 'Anonymous#' + id;
  }
  var user = new User(id, nickname);
  users.push(user);
  return user;
};

User.list = function () {
  return users;
};

User.remove = function (id) {
  for (var i = 0; i < users.length; ++i) {
    if (users[i].id === id) {
      var user = users[i];
      if (user.target !== null) {
        var target = User.find(user.target);
        target.target = null;
        user.target = null;
      }
      users.splice(i, 1);
      return true;
    }
  }
  return false;
};

User.find = function (id) {
  for (var i = 0; i < users.length; ++i) {
    if (users[i].id === id) {
      return users[i];
    }
  }
  return null;
}

module.exports = User;