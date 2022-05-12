const { createHash } = require('crypto');
const { sign } = require('jsonwebtoken');
const { verify } = require('jsonwebtoken');
const tweets = require('../data/tweets.js');
const users = require('../data/users.js');

const getTweets = (req, res) => {
    const authorization = req.headers.authorization;
    const token = authorization.replace('Bearer ', '');
    let verifyUser;
    try {
        verifyUser = verify(token, 'secret');
    } catch (error) {
        res.status(401).end();
        // TODO: verify失敗理由によってかき分ける
        return;
    }

    const user = users.find(({ id }) => id === verifyUser.userId);
    if (user) {
        res.json(tweets);
    } else {
        res.status(401).end();
        return;
    }
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
        const token = sign(
            {
                userId: user.id,
                userName: user.userName,
                email: user.email,
            },
            'secret'
            // { expiresIn: 60 * 60 }
        );
        return res.json(token);
    }

    return res.status(400).json({ code: 400 });
};

module.exports = {
    getTweets,
    createTweet,
    login,
};
