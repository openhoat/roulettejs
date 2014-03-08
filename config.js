// Feel free to match your settings
var config = {
  plugins: {
    'mvc': {
      type: 'mvc',
      config: {
        port: process.env['NODE_SOCKET_PATH'] || 3005,
        renderFormats: ['html'],
        locales: ['en', 'fr']
      }
    },
    'web-sockets': {
      type: 'web-sockets'
    }
  }
};

module.exports = config;
