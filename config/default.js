module.exports = {
  env: 'development',
  listenPort: process.env['NODE_SOCKET_PATH'] || 3000,
  log: {
    level: 'ws',
    format: {
      heading: 'roulettejs'
    },
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