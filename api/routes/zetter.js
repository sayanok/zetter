const express = require('express');
const router = express.Router();

const { getTweets } = require('../controllers/zetter.js');

router.get('/', getTweets);

module.exports = router;
