const express = require('express');
const router = express.Router();
const { verify } = require('jsonwebtoken');
const users = require('../data/users.js');

const {
    getTweets,
    getSpecificUsersTweets,
    getTweet,
    getReplys,
    createTweet,
    updateTweet,
    getProfile,
    updateProfile,
    login,
} = require('../controllers/zetter.js');

router.get('/', auth, getTweets);
router.get('/specificUsersTweets', auth, getSpecificUsersTweets);
router.get('/tweet/:tweetId', auth, getTweet);
router.get('/replys/:tweetId', auth, getReplys);
router.post('/', auth, createTweet);
router.patch('/', auth, updateTweet);

router.get('/profile', auth, getProfile);
router.patch('/profile', auth, updateProfile);

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
