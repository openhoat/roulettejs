module.exports = {
  env: 'development',
  listenPort: process.env['NODE_SOCKET_PATH'] || 3000,
  log: {
    format: {
      heading: 'roulettejs'
    },
    level: 'ws',
    levels: {
      ws: {
        value: 36,
        style: {
          fg: 'brightBlue',
          bg: 'black'
        },
        tag: 'WSOCK'
      }
    }
  },
  i18n: {
    locales: ['en', 'fr'],
    extension: '.json',
    updateFiles: false,
    directory: 'locales'
  }
};