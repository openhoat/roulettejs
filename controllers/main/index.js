var wbp = require('wbpjs')
  , config = wbp.config;

module.exports = {
  index:function (req, res) {
    wbp.render(res, function (type) {
      var view = wbp.getWebView(req, 'main/index', type);
      res.render(view, {
        title:'Roulettejs'
      });
    });
  }
};