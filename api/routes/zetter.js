const express = require('express');
const router = express.Router();

const { getTweets, createTweet, login } = require('../controllers/zetter.js');

router.get('/', getTweets);

router.post('/', createTweet);

router.post('/login', login);

module.exports = router;
