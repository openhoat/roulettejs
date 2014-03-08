var pkg = require('../../package')
  , wbp = require('wbpjs').getInstance(pkg.name);

var controller = {
  index:function (req, res) {
    wbp.render(res, function (type) {
      var view = wbp.getWebView(req, 'main/index', type);
      res.render(view);
    });
  }
};

module.exports = controller;