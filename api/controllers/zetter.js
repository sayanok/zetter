const tweets = require('../data.js');

const getTweets = (req, res) => {
    res.json(tweets);
};

const createTweet = (req, res) => {
    console.log(req.body);
    const newTweet = {
        id: tweets.length + 1,
        userName: req.body.userName,
        content: req.body.content,
        time: new Date(),
    };
    tweets.push(newTweet);
    res.status(201).json(newTweet);
};

module.exports = {
    getTweets,
    createTweet,
};
