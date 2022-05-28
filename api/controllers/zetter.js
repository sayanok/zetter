const { createHash } = require('crypto');
const { sign } = require('jsonwebtoken');
const tweets = require('../data/tweets.js');
const users = require('../data/users.js');

const getTweets = (req, res) => {
    res.json(tweets);
};

const createTweet = (req, res) => {
    const newTweet = {
        id: tweets.length + 1,
        userName: req.user.userName,
        content: req.body.content,
        time: new Date(),
    };
    tweets.push(newTweet);
    res.status(201).json(newTweet);
};

const getProfile = (req, res) => {
    const user = users.find((user) => user.userName === req.user.userName);

    res.json(user);
};

const updateProfile = (req, res) => {
    const user = users.find((user) => user.userName === req.user.userName);
    user.userName = req.body.userName;
    user.introduction = req.body.introduction;
    // もっとスマートにかけそう
    res.status(200).json(user);
};

const login = (req, res) => {
    const input = req.body;

    const user = users.find((user) => user.userName === input.userName);

    const hashedInputPassword = createHash('sha256').update(input.password).digest('base64');

    if (user && user.password === hashedInputPassword) {
        const token = sign(
            {
                userId: user.id,
                userName: user.userName,
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
