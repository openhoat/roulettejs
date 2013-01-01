var wbp = require('wbpjs')
  , mvcPlugin = wbp.findPlugin('wbpjs-mvc')
  , viewsPlugin = mvcPlugin.viewsPlugin;

var viewPrefix = 'main/';

var controller = {
  index:function (req, res) {
    viewsPlugin.render(res, function (type) {
      var view = viewsPlugin.getWebView(req, viewPrefix + 'index', type);
      res.render(view);
    });
  }
};

module.exports = controller;