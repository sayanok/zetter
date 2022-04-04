const tweets = require('../data.js');

const getTweets = (req, res) => {
    res.json(tweets);
};

module.exports = {
    getTweets,
};
