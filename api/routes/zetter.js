const express = require('express');
const router = express.Router();

const { getTweets, createTweet } = require('../controllers/zetter.js');

router.get('/', getTweets);

router.post('/', createTweet);

module.exports = router;
