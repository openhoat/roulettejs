var i18n = require('i18n');

module.exports = {
  init: function (hwe) {
    i18n.configure({
      locales: hwe.config.i18n.locales,
      extension: hwe.config.i18n.extension,
      updateFiles: hwe.config.i18n.updateFiles,
      directory: hwe.config.i18n.directory,
      register: global
    });
    hwe.app.locals({
      __i: i18n.__,
      __n: i18n.__n
    });
    hwe.app.use(i18n.init);
    hwe.app.use(function (req, res, next) {
      res.locals.currentUri = req._parsedUrl.pathname;
      res.locals.defaultLang = i18n.getLocale(req);
      res.locals.availableLangs = hwe.config.locales;
      var preferredLang = req.query.lang;
      if (preferredLang !== undefined) {
        req.session.preferredLang = (preferredLang === 'default' && null) || preferredLang;
      }
      if (!req.session.preferredLang) {
        req.session.preferredLang = i18n.getLocale(req);
      }
      if (req.session && req.session.preferredLang) {
        i18n.setLocale(req, req.session.preferredLang);
      }
      res.locals.preferredLang = i18n.getLocale(req);
      next();
    });
  }
};