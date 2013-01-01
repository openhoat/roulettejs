
// Feel free to match your settings
var config = {
  verbose:false,
  plugins:{
    'wbpjs-mvc':{
      type:'wbpjs-mvc',
      config:{
//        env:'devlopment',
        port:3005,
        renderFormats:['html'],
        locales:['en', 'fr']
      }
    },
    'web-sockets':{
      type:'web-sockets'
    }
  }
};

module.exports = config;