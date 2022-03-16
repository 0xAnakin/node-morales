const express = require('express');
const router = require('./lib/router');


const PORT = process.env.PORT || 3000;
const day_in_ms = 24 * 60 * 60 * 1000;
const app = express();

app.use(express.json());
app.use('/static', express.static('public'));
app.use(router);

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`);
});

server.timeout = day_in_ms
server.requestTimeout = day_in_ms;
server.headersTimeout = day_in_ms
server.keepAliveTimeout = day_in_ms;