const { createHash } = require('crypto');
const { sign } = require('jsonwebtoken');
const tweets = require('../data/tweets.js');
let favorities = require('../data/favorities.js');
const users = require('../data/users.js');

const getTweets = (req, res) => {
    const limit = 10;

    tweets.sort(function (a, b) {
        return b.createdAt - a.createdAt;
    });

    const result = addInformationToTweet(tweets, req);
    res.json(result.slice(0, limit));
};

const getTweet = (req, res) => {
    const tweet = tweets.find((tweet) => tweet.id === parseInt(req.params.tweetId));

    const numberOfFavorite = favorities.filter((favorite) => favorite.tweetId === tweet.id);
    tweet['numberOfFavorite'] = numberOfFavorite.length;

    const numberOfReply = tweets.filter((replyTweet) => replyTweet.replyTo === tweet.id);
    tweet['numberOfReply'] = numberOfReply.length;

    // ツイートに自分がfavしているかの情報を付加するための準備
    const favoriteTweetIds = favorities.filter((favorite) => favorite.userId === req.user.id).map((obj) => obj.tweetId);
    tweet.isFavorite = favoriteTweetIds.includes(tweet.id);

    res.json(tweet);
};

const getReplys = (req, res) => {
    let replys = [];
    tweets.forEach((tweet) => {
        if (tweet.replyTo === parseInt(req.params.tweetId)) {
            replys.push(tweet);
        }
    });

    const result = addInformationToTweet(replys, req);
    res.json(result);
};

const createTweet = (req, res) => {
    const newTweet = {
        id: tweets.length + 1,
        createdBy: req.user.id,
        replyTo: req.body.replyTo,
        content: req.body.content,
        createdAt: new Date(),
    };
    tweets.push(newTweet);
    res.status(201).json(newTweet);
};

const updateTweet = (req, res) => {
    const tweet = req.body.tweet;

    if (req.body.order === 'add') {
        favorities.push({
            id: favorities.length + 1,
            // TODO: DBとつなぐときなおしたい
            tweetId: tweet.id,
            userId: req.user.id,
            createdAt: new Date(),
        });
        tweet.isFavorite = true;
        tweet.numberOfFavorite++;
    } else {
        favorities = favorities.filter(
            (favorite) => favorite.tweetId !== req.body.tweet.id || favorite.userId !== req.user.id
        );
        tweet.isFavorite = false;
        tweet.numberOfFavorite--;
    }
    res.status(200).json(tweet);
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

function addInformationToTweet(tweetList, req) {
    // ツイートに自分がfavしているかの情報を付加するための準備
    const usersFavoriteTweets = favorities.filter((favorite) => favorite.userId === req.user.id);
    const favoriteTweetIds = usersFavoriteTweets.map((obj) => obj.tweetId);

    tweetList.forEach((tweet) => {
        const user = users.find(({ id }) => id === tweet.createdBy);
        tweet['user'] = user;

        const numberOfFavorite = favorities.filter((favorite) => favorite.tweetId === tweet.id);
        tweet['numberOfFavorite'] = numberOfFavorite.length;

        const numberOfReply = tweets.filter((replyTweet) => replyTweet.replyTo === tweet.id);
        tweet['numberOfReply'] = numberOfReply.length;

        tweet.isFavorite = favoriteTweetIds.includes(tweet.id);
    });

    return tweetList;
}

module.exports = {
    getTweets,
    getTweet,
    getReplys,
    createTweet,
    updateTweet,
    getProfile,
    updateProfile,
    login,
};
