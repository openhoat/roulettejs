var wbp = require('wbpjs');

var controller = {
  index:function (req, res) {
    wbp.render(res, function (type) {
      var view = wbp.getWebView(req, 'main/index', type);
      res.render(view);
    });
  }
};

module.exports = controller;