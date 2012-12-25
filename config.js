var path = require('path')
  , baseDir = __dirname;

function configureMongo() {
  var env, mongo;
  if (process.env.VCAP_SERVICES) {
    env = JSON.parse(process.env.VCAP_SERVICES);
    mongo = env['mongodb-1.8'][0].credentials;
  } else {
    mongo = {
      'hostname':'localhost',
      'port':27017,
      'username':'',
      'password':'',
      'name':'',
      'db':'db'
    };
  }
  return mongo;
}

function buildPersistence(type) {
  switch (type) {
    case 'mongo':
      return { type:type, config:configureMongo() };
    default:
      return { type:'mock' };
  }
}

// Feel free to match your settings
var config = {
  port:3000,
  baseDir:baseDir,
  controllersDir:path.join(baseDir, 'controllers'),
  viewsDir:path.join(baseDir, 'views'),
  lesscssDir:path.join(baseDir, 'lesscss'),
  publicDir:path.join(baseDir, 'public'),
  cssDir:path.join(baseDir, 'public', 'css'),
  mobileViewSufix:null,
  renderFormats:['html'],
  persistence:buildPersistence('mock'),
  options:{
    verbose:true
  }
};

module.exports = config;
