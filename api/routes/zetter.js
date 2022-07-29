const express = require('express');
const router = express.Router();
const { verify } = require('jsonwebtoken');
const users = require('../data/users.js');

const {
    getTweets,
    getSpecificUsersTweets,
    getSpecificUsersFavoriteTweets,
    getTweet,
    getReplys,
    createTweet,
    updateTweet,
    getNotifications,
    getProfile,
    updateProfile,
    getFollowings,
    getFollowers,
    login,
} = require('../controllers/zetter.js');

router.get('/', auth, getTweets);
router.get('/specificUsersTweets/:username', auth, getSpecificUsersTweets);
router.get('/specificUsersFavoriteTweets/:username', auth, getSpecificUsersFavoriteTweets);
router.get('/tweet/:tweetId', auth, getTweet);
router.get('/replys/:tweetId', auth, getReplys);
router.post('/', auth, createTweet);
router.patch('/', auth, updateTweet);

router.get('/notifications', auth, getNotifications);

router.get('/profile/:username', auth, getProfile);
router.patch('/profile', auth, updateProfile);

router.get('/followings', auth, getFollowings);
router.get('/followers', auth, getFollowers);

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
