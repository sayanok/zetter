import tweets from '../data/tweets';
import users from '../data/users';
import followers from '../data/followers';
import favorities from '../data/favorities';
import { sign } from 'jsonwebtoken';
import { createHash } from 'crypto';
import { Request, Response } from 'express';
import { FavoriteType, FollowerType, ProfileType, TweetType } from '../utils/types';
import { prisma } from '../utils/prisma';
import { Tweet, User } from '@prisma/client';

export const getTweets = async (req: Request, res: Response) => {
    const limit: number = 10;
    // const followingUsers = await prisma.follower.findMany({
    // where: username =
    // })
    const followingUsers: Array<FollowerType> = followers.filter((follower) => follower.from === req.user.id);
    const followingUsersAndMyIds: Array<number> = followingUsers.map((obj) => obj.to);

    followingUsersAndMyIds.push(req.user.id);
    const followingUsersTweetsList: Array<Tweet> = await prisma.tweet.findMany({
        where: {
            createdBy: {
                in: followingUsersAndMyIds,
            },
        },
        include: {
            user: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    res.json(followingUsersTweetsList.slice(0, limit));
};

export const getSpecificUsersTweets = async (req: Request, res: Response) => {
    const limit: number = 10;
    const user: User | null = await prisma.user.findUnique({
        where: { username: req.user.username },
    });
    const sortedTweets: Array<TweetType> = tweets.sort(function (a: TweetType, b: TweetType) {
        if (Number(a.createdAt) - Number(b.createdAt)) {
            return -1;
        } else {
            return 1;
        }
    });

    if (user) {
        const specificUsersTweets: Array<TweetType> = sortedTweets.filter((tweet) => tweet.createdBy === user.id);
        const result: Array<String> = [];

        // const result: Array<TweetType> = addInformationToTweet(specificUsersTweets, req);
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
    const result: Array<String> = [];

    // const result: Array<TweetType> = addInformationToTweet(sortedFavoriteTweetList, req);
    res.json(result.slice(0, limit));
};

export const getTweet = async (req: Request, res: Response) => {
    const tweet: Tweet | null = await prisma.tweet.findUnique({
        where: {
            id: Number(req.params.tweetId),
        },
        include: {
            user: true,
            favorities: true,
        },
    });
    if (!tweet) {
        throw Error;
    }

    res.json(tweet);
};

export const getReplys = (req: Request, res: Response) => {
    let replys: Array<TweetType> = [];
    tweets.forEach((tweet) => {
        if (tweet.replyTo === parseInt(req.params.tweetId)) {
            replys.push(tweet);
        }
    });
    const result: Array<String> = [];

    // const result: Array<TweetType> = addInformationToTweet(replys, req);
    res.json(result);
};

export const createTweet = async (req: Request, res: Response) => {
    const newTweet: Tweet = await prisma.tweet.create({
        data: {
            createdBy: req.user.id,
            replyTo: req.body.replyTo,
            content: req.body.content,
            createdAt: new Date(),
        },
    });
    res.status(201).json(newTweet);
};

export const updateTweet = async (req: Request, res: Response) => {
    const tweet: Tweet | null = await prisma.tweet.findUnique({
        where: {
            id: req.body.tweet.id,
        },
    });

    if (!tweet) {
        throw Error;
    }

    if (req.body.order === 'add') {
        await prisma.favorite.create({
            data: {
                tweetId: tweet.id,
                userId: req.user.id,
            },
        });

        await prisma.tweet.update({
            where: {
                id: tweet.id,
            },
            data: {
                numberOfFavorite: tweet.numberOfFavorite + 1,
                isFavorite: true,
            },
        });
    } else {
        await prisma.favorite.delete({
            where: {
                tweetId_userId: {
                    tweetId: tweet.id,
                    userId: req.user.id,
                },
            },
        });

        await prisma.tweet.update({
            where: {
                id: tweet.id,
            },
            data: {
                numberOfFavorite: tweet.numberOfFavorite - 1,
                isFavorite: false,
            },
        });
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
    // const result: Array<TweetType> = addInformationToTweet(sortedTweets, req);
    const result: Array<String> = [];
    res.json(result.slice(0, limit));
};

export const getMyProfile = async (req: Request, res: Response) => {
    const username: string = req.user.username;
    const user: User | null = await prisma.user.findUnique({
        where: {
            username: username,
        },
    });

    res.json(user);
};

export const getProfile = async (req: Request, res: Response) => {
    const username: string = req.params.username;
    const user: User | null = await prisma.user.findUnique({
        where: {
            username: username,
        },
    });
    res.json(user);
};

export const updateProfile = async (req: Request, res: Response) => {
    const user: User | null = await prisma.user.update({
        where: {
            username: req.user.username,
        },
        data: {
            username: req.body.username,
            introduction: req.body.introduction,
            email: req.body.email,
        },
    });

    res.status(200).json(user);
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

export const login = async (req: Request, res: Response) => {
    const input: any = req.body;
    const username: string = input.username;
    const user: User | null = await prisma.user.findUnique({
        where: {
            username: username,
        },
    });
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

function addInformationToTweet(tweetList: Array<Tweet>, req: Request) {
    // ツイートに自分がfavしているかの情報を付加するための準備
    const usersFavoriteTweets: Array<FavoriteType> = favorities.filter((favorite) => favorite.userId === req.user.id);
    const favoriteTweetIds: Array<number> = usersFavoriteTweets.map((obj) => obj.tweetId);

    tweetList.forEach(async (tweet) => {
        const numberOfFavorite = await prisma.favorite.count({
            where: {
                tweetId: tweet.id,
            },
        });

        const numberOfReply = await prisma.tweet.count({
            where: {
                replyTo: tweet.id,
            },
        });

        await prisma.tweet.update({
            where: {
                id: tweet.id,
            },
            data: {
                numberOfFavorite: numberOfFavorite,
                numberOfReply: numberOfReply,
            },
        });

        // tweet.isFavorite = favoriteTweetIds.includes(tweet.id);
    });

    return tweetList;
}

module.exports = {
    getTweets, //おきかえた
    getSpecificUsersTweets,
    getSpecificUsersFavoriteTweets,
    getTweet, // おきかえた
    getReplys,
    createTweet, //おきかえた
    updateTweet, //おきかえた
    getNotifications,
    getMyProfile, // おきかえた
    getProfile, // おきかえた
    updateProfile, // おきかえた
    getFollowings,
    getFollowers,
    updateFollowings,
    login,
};
