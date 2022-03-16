const express = require('express');
const router = express.Router();

const rootHandler = require('./routes/root');
const searchHandler = require('./routes/search');
const playHandler = require('./routes/play');
const streamHandler = require('./routes/stream');
const notFoundHandler = require('./routes/not-found');

router.get('/', rootHandler);
router.get('/search/:search_request', searchHandler);
router.get('/play/:play_request', playHandler);
router.get('/stream', streamHandler);
router.get('*', notFoundHandler);

module.exports = router;