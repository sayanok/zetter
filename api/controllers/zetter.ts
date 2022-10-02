import tweets from '../data/tweets';
import users from '../data/users';
import followers from '../data/followers';
import favorities from '../data/favorities';
import { createHash } from 'crypto';
import { Request, Response } from 'express';
import { FavoriteType, FollowerType, ProfileType, TweetType } from '../utils/types';

export const getTweets = (req: Request, res: Response) => {
    const limit: number = 10;
    const followingUsers: Array<FollowerType> = followers.filter((follower) => follower.from === req.user.id);
    const followingUsersIds: Array<number> = followingUsers.map((obj) => obj.to);
    let followingUsersTweetsList: Array<TweetType> = [];

    tweets.forEach((tweet) => {
        if (followingUsersIds.includes(tweet.createdBy)) {
            followingUsersTweetsList.push(tweet);
        }
    });

    followingUsersTweetsList.sort(function (a: TweetType, b: TweetType) {
        return Number(b.createdAt) - Number(a.createdAt);
    });

    const result = addInformationToTweet(followingUsersTweetsList, req);
    res.json(result.slice(0, limit));
};

export const login = (req: Request, res: Response) => {
    const input: any = req.body;
    const user: ProfileType | undefined = users.find((user) => user.username === input.username);
    const hashedInputPassword: string = createHash('sha256').update(input.passwore).digest('base64');

    if (user && user.password === hashedInputPassword) {
    }
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

module.exports = { getTweets, login };
