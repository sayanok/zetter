const { createHash } = require('crypto');
const { sign } = require('jsonwebtoken');
const tweets = require('../data/tweets.js');
let favorities = require('../data/favorities.js');
const users = require('../data/users.js');

const getTweets = (req, res) => {
    const limit = 10;

    const sortedTweets = tweets.sort(function (a, b) {
        if (a.createdAt > b.createdAt) {
            return -1;
        } else {
            return 1;
        }
    });

    const result = addInformationToTweet(sortedTweets, req);
    res.json(result.slice(0, limit));
};

const getSpecificUsersTweets = (req, res) => {
    const limit = 10;

    const user = users.find(({ username }) => username === req.params.username);
    const sortedTweets = tweets.sort(function (a, b) {
        if (a.createdAt > b.createdAt) {
            return -1;
        } else {
            return 1;
        }
    });
    const specificUsersTweets = sortedTweets.filter((tweet) => tweet.createdBy === user.id);

    const result = addInformationToTweet(specificUsersTweets, req);
    res.json(result.slice(0, limit));
};

const getSpecificUsersFavoriteTweets = (req, res) => {
    const limit = 10;
    const user = users.find(({ username }) => username === req.params.username);
    const favoriteTweets = favorities.filter((favorite) => favorite.userId === user.id);
    const favoriteTweetIds = favoriteTweets.map((obj) => obj.tweetId);

    let favoriteTweetList = [];

    tweets.forEach((tweet) => {
        if (favoriteTweetIds.includes(tweet.id)) {
            favoriteTweetList.push(tweet);
        }
    });

    const sortedFavoriteTweetList = favoriteTweetList.sort(function (a, b) {
        if (a.createdAt > b.createdAt) {
            return -1;
        } else {
            return 1;
        }
    });

    const result = addInformationToTweet(sortedFavoriteTweetList, req);
    res.json(result.slice(0, limit));
};

const getTweet = (req, res) => {
    const tweet = tweets.find((tweet) => tweet.id === parseInt(req.params.tweetId));

    const numberOfFavorite = favorities.filter((favorite) => favorite.tweetId === tweet.id);
    tweet['numberOfFavorite'] = numberOfFavorite.length;

    const numberOfReply = tweets.filter((replyTweet) => replyTweet.replyTo === tweet.id);
    tweet['numberOfReply'] = numberOfReply.length;

    // ツイートに自分がfavしているかの情報を付加するための準備
    const usersFavoriteTweets = favorities.filter((favorite) => favorite.userId === req.user.id);
    const favoriteTweetIds = usersFavoriteTweets.map((obj) => obj.tweetId);

    if (favoriteTweetIds.includes(tweet.id)) {
        tweet.isFavorite = true;
    } else {
        tweet.isFavorite = false;
    }

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

const getNotifications = (req, res) => {
    const limit = 10;
    let notifications = [];
    let replyNotifications = [];
    let favoriteNotifications = [];

    const specificUsersTweets = tweets.filter((tweet) => tweet.createdBy === req.user.id);

    // リプライを取得
    tweets.forEach((tweet) => {
        specificUsersTweets.forEach((specificUsersTweet) => {
            if (tweet.replyTo === specificUsersTweet.id) {
                replyNotifications.push(tweet);
            }
        });
    });

    // favを取得
    favorities.forEach((favorite) => {
        let valueOfInsert = [];
        specificUsersTweets.forEach((specificUsersTweet) => {
            if (favorite.tweetId === specificUsersTweet.id) {
                const user = users.find((user) => user.id === favorite.userId);
                specificUsersTweet['favoriteNotification'] = favorite;
                specificUsersTweet['favoriteNotification']['user'] = user;

                valueOfInsert = JSON.parse(JSON.stringify(specificUsersTweet));
                favoriteNotifications.push(valueOfInsert);
            }
        });
    });

    notifications = replyNotifications.concat(favoriteNotifications);

    const sortedTweets = notifications.sort(function (a, b) {
        if (a.createdAt > b.createdAt) {
            return -1;
        } else {
            return 1;
        }
    });
    const result = addInformationToTweet(sortedTweets, req);
    res.json(result.slice(0, limit));
};

const getProfile = (req, res) => {
    let username;
    if (req.params.username === 'login') {
        username = req.user.username;
    } else {
        username = req.params.username;
    }

    const user = users.find((user) => user.username === username);
    res.json(user);
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

        if (favoriteTweetIds.includes(tweet.id)) {
            tweet.isFavorite = true;
        } else {
            tweet.isFavorite = false;
        }
    });

    return tweetList;
}

module.exports = {
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
    login,
};
