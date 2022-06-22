const https = require('https');
const http = require('http');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

const port = 3000;

app.use(express.static(path.join(__dirname)));

app.get('/*', (req, res) => {
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Date: Date.now(),
  });
  res.sendFile(path.join(__dirname, 'index.html'));
});

const options = {
  cert: fs.readFileSync('/etc/letsencrypt/live/grandfisher.io/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/grandfisher.io/privkey.pem'),
};

// http.createServer(app).listen(port, () => {
//   console.log(`app listening at ${port}`);
// });

https.createServer(options, app).listen(port, () => {
  console.log(`app listening at ${port}`);
});
