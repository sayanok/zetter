const express = require('express');
const router = express.Router();
const { verify } = require('jsonwebtoken');
const users = require('../data/users.js');

const { getTweets, createTweet, login } = require('../controllers/zetter.js');

router.get('/', auth, getTweets);

router.post('/', auth, createTweet);

router.post('/login', login);

module.exports = router;

function auth(req, res, next) {
    const authorization = req.headers.authorization;
    const token = authorization.replace('Bearer ', '');
    let verifyUser;
    try {
        verifyUser = verify(token, process.env.SECRET_KEY);
    } catch (error) {
        res.status(401).end();
        // TODO: verify失敗理由によってかき分ける
        return;
    }

    const user = users.find(({ id }) => id === verifyUser.userId);
    if (user) {
        req.user = user;
        next();
    } else {
        res.status(401).end();
        return;
    }
}
