const express = require('express');
const router = require('./lib/router');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use('/static', express.static('public'));
app.use(router);

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`);
});

server.timeout = 31000
server.requestTimeout = 5000;
server.headersTimeout = 30000
server.keepAliveTimeout = 29900;