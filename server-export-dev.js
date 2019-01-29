const express = require('express');
const path = require('path');
const proxy = require('http-proxy-middleware');

const server = express();

server.use('/api', proxy({
  target: 'url_of_server',
  changeOrigin: true,
  secure: false,
}));

server.use('/', express.static(path.join(__dirname, 'out')))

server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
});
