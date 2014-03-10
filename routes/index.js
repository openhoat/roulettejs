module.exports = {
  init: function (hwe) {
    hwe.app.get('/', function (req, res) {
      res.render('index');
    });
  }
};

