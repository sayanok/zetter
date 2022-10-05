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

export const getSpecificUsersFavoriteTweets = (req: Request, res: Response) => {
    const limit: number = 10;
    const user: ProfileType | undefined = users.find(({ username }) => username === req.params.username);
    if (!user) {
        throw Error;
    }
    const favoriteTweets: Array<FavoriteType> = favorities.filter((favorite) => favorite.userId === user.id);
    const favoriteTweetIds: Array<number> = favoriteTweets.map((obj) => obj.tweetId);

    let favoriteTweetList: Array<TweetType> = [];

    tweets.forEach((tweet) => {
        if (favoriteTweetIds.includes(tweet.id)) {
            favoriteTweetList.push(tweet);
        }
    });

    const sortedFavoriteTweetList: Array<TweetType> = favoriteTweetList.sort(function (a, b) {
        if (a.createdAt > b.createdAt) {
            return -1;
        } else {
            return 1;
        }
    });

    const result: Array<TweetType> = addInformationToTweet(sortedFavoriteTweetList, req);
    res.json(result.slice(0, limit));
};

export const getTweet = (req: Request, res: Response) => {
    const tweet: TweetType | undefined = tweets.find((tweet) => tweet.id === parseInt(req.params.tweetId));

    if (!tweet) {
        throw Error;
    }

    const numberOfFavorite: Array<FavoriteType> = favorities.filter((favorite) => favorite.tweetId === tweet.id);
    tweet['numberOfFavorite'] = numberOfFavorite.length;

    const numberOfReply: Array<TweetType> = tweets.filter((replyTweet) => replyTweet.replyTo === tweet.id);
    tweet['numberOfReply'] = numberOfReply.length;

    // ツイートに自分がfavしているかの情報を付加するための準備
    const favoriteTweetIds: Array<number> = favorities
        .filter((favorite) => favorite.userId === req.user.id)
        .map((obj) => obj.tweetId);
    tweet.isFavorite = favoriteTweetIds.includes(tweet.id);

    res.json(tweet);
};

export const getReplys = (req: Request, res: Response) => {
    let replys: Array<TweetType> = [];
    tweets.forEach((tweet) => {
        if (tweet.replyTo === parseInt(req.params.tweetId)) {
            replys.push(tweet);
        }
    });

    const result: Array<TweetType> = addInformationToTweet(replys, req);
    res.json(result);
};

export const createTweet = (req: Request, res: Response) => {
    const newTweet: TweetType = {
        id: tweets.length + 1,
        createdBy: req.user.id,
        replyTo: req.body.replyTo,
        content: req.body.content,
        createdAt: new Date(),
    };
    tweets.push(newTweet);
    res.status(201).json(newTweet);
};

export const updateTweet = (req: Request, res: Response) => {
    const tweet: TweetType = req.body.tweet;
    if (!tweet.numberOfFavorite) {
        tweet.numberOfFavorite = 0;
    }

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
        // favorities = favorities.filter(
        //     (favorite) => favorite.tweetId !== req.body.tweet.id || favorite.userId !== req.user.id
        // );
        tweet.isFavorite = false;
        tweet.numberOfFavorite--;
    }
    res.status(200).json(tweet);
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

// フォローしているユーザー
export const getFollowings = (req: Request, res: Response) => {
    const requestUser: ProfileType | undefined = users.find(({ username }) => username === req.params.username);
    let specificUserFollowingUsersList: Array<FollowerType> = [];
    let specificUserFollowingUsersListWithUserInformation: Array<FollowerType> = [];
    if (requestUser) {
        followers.forEach((follower) => {
            if (follower.from === requestUser.id) {
                specificUserFollowingUsersList.push(follower);
            }
        });

        specificUserFollowingUsersList.forEach((specificUserFollowingUser) => {
            let valueOfInsert: FollowerType;
            users.forEach((user) => {
                if (specificUserFollowingUser.to === user.id) {
                    specificUserFollowingUser['user'] = user;

                    valueOfInsert = JSON.parse(JSON.stringify(specificUserFollowingUser));
                    specificUserFollowingUsersListWithUserInformation.push(valueOfInsert);
                }
            });
        });
        res.json(specificUserFollowingUsersList);
    }
};

// 自分のフォロワー
export const getFollowers = (req: Request, res: Response) => {
    const requestUser: ProfileType | undefined = users.find(({ username }) => username === req.params.username);
    let specificUserFollowersUsersList: Array<FollowerType> = [];
    let specificUserFollowersUsersListWithUserInformation: Array<FollowerType> = [];
    if (requestUser) {
        followers.forEach((follower) => {
            if (follower.to === requestUser.id) {
                specificUserFollowersUsersList.push(follower);
            }
        });

        specificUserFollowersUsersList.forEach((specificUserFollowerdUser) => {
            let valueOfInsert: FollowerType;
            users.forEach((user) => {
                if (specificUserFollowerdUser.from === user.id) {
                    specificUserFollowerdUser['user'] = user;

                    valueOfInsert = JSON.parse(JSON.stringify(specificUserFollowerdUser));
                    specificUserFollowersUsersListWithUserInformation.push(valueOfInsert);
                }
            });
        });

        res.json(specificUserFollowersUsersList);
    }
};

export const updateFollowings = (req: Request, res: Response) => {
    const followings: string = req.body.followings;
    const user: ProfileType | undefined = req.user;
    const userToEdit: ProfileType | undefined = users.find(({ username }) => username === req.body.followingUsername);

    if (user && userToEdit) {
        if (req.body.action === 'follow') {
            followers.push({
                id: followers.length + 1,
                // TODO: DBとつなぐときなおしたい
                to: userToEdit.id,
                from: user.id,
                createdAt: new Date(),
            });
        } else {
            // followers = followers.filter((follower) => follower.to !== userToEdit.id || follower.from !== user.id);
        }
        res.status(200).json(followings);
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
    getSpecificUsersFavoriteTweets,
    getTweet,
    getReplys,
    createTweet,
    updateTweet,
    getNotifications,
    getMyProfile,
    getProfile,
    updateProfile,
    getFollowings,
    getFollowers,
    updateFollowings,
    login,
};
