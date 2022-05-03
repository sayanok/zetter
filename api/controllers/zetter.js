const { createHash } = require('crypto');
const tweets = require('../data/tweets.js');
const users = require('../data/users.js');

const getTweets = (req, res) => {
    res.json(tweets);
};

const createTweet = (req, res) => {
    const newTweet = {
        id: tweets.length + 1,
        userName: req.body.userName,
        content: req.body.content,
        time: new Date(),
    };
    tweets.push(newTweet);
    res.status(201).json(newTweet);
};

const login = (req, res) => {
    const input = req.body;

    const user = users.find((user) => user.userName === input.userName);

    const hashedInputPassword = createHash('sha256').update(input.password).digest('base64');

    if (user && user.password === hashedInputPassword) {
        return res.json(user);
    }

    return res.status(400).json({ code: 400 });
};

module.exports = {
    getTweets,
    createTweet,
    login,
};
