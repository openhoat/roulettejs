module.exports = {
  init: function (hwe) {
    hwe.logger.info('middlewares init');
    require('./middleware-i18n').init(hwe);
  }
};