import tweets from '../data/tweets';
import users from '../data/users';
import followers from '../data/followers';
import favorities from '../data/favorities';
import { sign } from 'jsonwebtoken';
import { createHash } from 'crypto';
import { Request, Response } from 'express';
import { FavoriteType, FollowerType, ProfileType, TweetType } from '../utils/types';

export const getTweets = (req: Request, res: Response) => {
    const limit: number = 10;
    const followingUsers: Array<FollowerType> = followers.filter((follower) => follower.from === req.user.id);
    const followingUsersAndMyIds: Array<number> = followingUsers.map((obj) => obj.to);
    let followingUsersTweetsList: Array<TweetType> = [];

    followingUsersAndMyIds.push(req.user.id);
    tweets.forEach((tweet) => {
        if (followingUsersAndMyIds.includes(tweet.createdBy)) {
            followingUsersTweetsList.push(tweet);
        }
    });

    followingUsersTweetsList.sort(function (a: TweetType, b: TweetType) {
        return Number(b.createdAt) - Number(a.createdAt);
    });

    const result: Array<TweetType> = addInformationToTweet(followingUsersTweetsList, req);
    res.json(result.slice(0, limit));
};

export const getSpecificUsersTweets = (req: Request, res: Response) => {
    const limit: number = 10;
    const user: ProfileType | undefined = users.find(({ username }) => username === req.params.username);
    const sortedTweets: Array<TweetType> = tweets.sort(function (a: TweetType, b: TweetType) {
        if (Number(a.createdAt) - Number(b.createdAt)) {
            return -1;
        } else {
            return 1;
        }
    });

    if (user) {
        const specificUsersTweets: Array<TweetType> = sortedTweets.filter((tweet) => tweet.createdBy === user.id);
        const result: Array<TweetType> = addInformationToTweet(specificUsersTweets, req);
        res.json(result.slice(0, limit));
    }
};

export const getNotifications = (req: Request, res: Response) => {
    const limit: number = 10;
    let notifications: Array<TweetType> = [];
    let favoriteNotifications: Array<TweetType> = [];

    const specificUsersTweets: Array<TweetType> = tweets.filter((tweet) => tweet.createdBy === req.user.id);

    // リプライを取得
    const replyNotifications: Array<TweetType> = tweets.filter((tweet) =>
        specificUsersTweets.some((specificUsersTweet) => specificUsersTweet.id === tweet.replyTo)
    );

    // favを取得
    favorities.forEach((favorite) => {
        specificUsersTweets.forEach((specificUsersTweet) => {
            if (favorite.tweetId === specificUsersTweet.id) {
                const user: ProfileType | undefined = users.find((user) => user.id === favorite.userId);
                const copied: TweetType = { ...specificUsersTweet };

                copied['favoriteNotification'] = favorite;
                copied['favoriteNotification']['user'] = user;

                favoriteNotifications.push(copied);
            }
        });
    });

    notifications = replyNotifications.concat(favoriteNotifications);

    const sortedTweets: Array<TweetType> = notifications.sort(function (a: TweetType, b: TweetType) {
        if (a.createdAt > b.createdAt) {
            return -1;
        } else {
            return 1;
        }
    });
    const result: Array<TweetType> = addInformationToTweet(sortedTweets, req);
    res.json(result.slice(0, limit));
};

export const getMyProfile = (req: Request, res: Response) => {
    const username: string = req.user.username;
    const user: ProfileType | undefined = users.find((user) => user.username === username);
    res.json(user);
};

export const getProfile = (req: Request, res: Response) => {
    const username: string = req.params.username;
    const user: ProfileType | undefined = users.find((user) => user.username === username);
    res.json(user);
};

export const updateProfile = (req: Request, res: Response) => {
    const user: ProfileType | undefined = users.find((user) => user.username === req.user.username);
    if (user) {
        user.username = req.body.username;
        user.introduction = req.body.introduction;
        user.email = req.body.email;
        // もっとスマートにかけそう
        res.status(200).json(user);
    }
};

export const login = (req: Request, res: Response) => {
    const input: any = req.body;
    const user: ProfileType | undefined = users.find((user) => user.username === input.username);
    const hashedInputPassword: string = createHash('sha256').update(input.password).digest('base64');
    if (user && user.password === hashedInputPassword) {
        const token: string = sign(
            {
                userId: user.id,
                username: user.username,
                email: user.email,
            },
            process.env.SECRET_KEY!
            // { expiresIn: 60 * 60 }
        );
        return res.json(token);
    }
    return res.status(400).json({ code: 400 });
};

function addInformationToTweet(tweetList: Array<TweetType>, req: Request) {
    // ツイートに自分がfavしているかの情報を付加するための準備
    const usersFavoriteTweets: Array<FavoriteType> = favorities.filter((favorite) => favorite.userId === req.user.id);
    const favoriteTweetIds: Array<number> = usersFavoriteTweets.map((obj) => obj.tweetId);

    tweetList.forEach((tweet) => {
        const user: ProfileType | undefined = users.find(({ id }) => id === tweet.createdBy);
        tweet['user'] = user;

        const numberOfFavorite: Array<FavoriteType> = favorities.filter((favorite) => favorite.tweetId === tweet.id);
        tweet['numberOfFavorite'] = numberOfFavorite.length;

        const numberOfReply: Array<TweetType> = tweets.filter((replyTweet) => replyTweet.replyTo === tweet.id);
        tweet['numberOfReply'] = numberOfReply.length;

        tweet.isFavorite = favoriteTweetIds.includes(tweet.id);
    });

    return tweetList;
}

module.exports = {
    getTweets,
    getSpecificUsersTweets,
    getNotifications,
    getMyProfile,
    getProfile,
    updateProfile,
    login,
};
