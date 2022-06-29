const { createHash } = require('crypto');
const { sign } = require('jsonwebtoken');
const tweets = require('../data/tweets.js');
const users = require('../data/users.js');

const getTweets = (req, res) => {
    const limit = 10;

    tweets.sort(function (a, b) {
        if (a.createdAt > b.createdAt) {
            return -1;
        } else {
            return 1;
        }
    });

    tweets.forEach((tweet) => {
        const user = users.find((user) => user.id === tweet.userId);
        tweet['user'] = user;
    });
    res.json(tweets.slice(0, limit));
};

const createTweet = (req, res) => {
    const newTweet = {
        id: tweets.length + 1,
        userId: req.user.id,
        username: req.user.username,
        content: req.body.content,
        createdAt: new Date(),
    };
    tweets.push(newTweet);
    res.status(201).json(newTweet);
};

const getProfile = (req, res) => {
    res.json(req.user);
};

const updateProfile = (req, res) => {
    const user = users.find((user) => user.username === req.user.username);
    user.username = req.body.username;
    user.introduction = req.body.introduction;
    user.email = req.body.email;
    // もっとスマートにかけそう
    res.status(200).json(user);
};

const login = (req, res) => {
    const input = req.body;

    const user = users.find((user) => user.username === input.username);

    const hashedInputPassword = createHash('sha256').update(input.password).digest('base64');

    if (user && user.password === hashedInputPassword) {
        const token = sign(
            {
                userId: user.id,
                username: user.username,
                email: user.email,
            },
            process.env.SECRET_KEY
            // { expiresIn: 60 * 60 }
        );
        return res.json(token);
    }

    return res.status(400).json({ code: 400 });
};

module.exports = {
    getTweets,
    createTweet,
    getProfile,
    updateProfile,
    login,
};
