import { sign } from 'jsonwebtoken';
import { createHash } from 'crypto';
import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { Tweet, User, Favorite } from '@prisma/client';
import { userInfo } from 'os';

export const getTweets = async (req: Request, res: Response) => {
    const limit: number = 10;
    const timelineTweetsList: Array<Tweet> = await prisma.tweet.findMany({
        where: {
            user: {
                OR: [{ id: req.user.id }, { followedBy: { some: { id: req.user.id } } }],
            },
        },
        include: {
            user: true,
            favorities: true,
            replyFrom: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: limit,
    });
    res.json(timelineTweetsList);
};

export const getSpecificUsersTweets = async (req: Request, res: Response) => {
    const limit: number = 10;
    const userAndTweets = await prisma.user.findUnique({
        where: { username: req.params.username },
        include: {
            tweets: {
                orderBy: { createdAt: 'desc' },
                take: limit,
                include: {
                    user: true,
                    favorities: true,
                    replyFrom: true,
                },
            },
        },
    });
    if (!userAndTweets) {
        throw Error('getSpecificUsersTweetsでuserAndTweetsが存在してないっぽいよ');
    }
    res.json(userAndTweets.tweets);
};

export const getSpecificUsersFavoriteTweets = async (req: Request, res: Response) => {
    const limit: number = 10;
    const userAndFavoriteTweets = await prisma.user.findUnique({
        where: { username: req.user.username },
        include: {
            favorities: {
                where: { userId: req.user.id },
                include: {
                    tweet: {
                        include: {
                            user: true,
                            favorities: true,
                            replyFrom: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: limit,
            },
        },
    });
    if (!userAndFavoriteTweets) {
        throw Error('getSpecificUsersFavoriteTweetsでuserAndFavoriteTweetsが存在してないっぽいよ');
    }

    res.json(userAndFavoriteTweets.favorities.map((favorite) => favorite.tweet));
};

export const getTweet = async (req: Request, res: Response) => {
    const tweet: Tweet | null = await prisma.tweet.findUnique({
        where: {
            id: Number(req.params.tweetId),
        },
        include: {
            user: true,
            favorities: true,
            replyFrom: true,
        },
    });
    if (!tweet) {
        throw Error('getTweetでtweetが存在してないっぽいよ');
    }

    res.json(tweet);
};

export const getReplys = async (req: Request, res: Response) => {
    const replys = await prisma.tweet.findMany({
        where: {
            replyToId: parseInt(req.params.tweetId),
        },
        include: { user: true, favorities: true, replyFrom: true },
    });
    res.json(replys);
};

export const createTweet = async (req: Request, res: Response) => {
    const newTweet: Tweet = await prisma.tweet.create({
        data: {
            createdBy: req.user.id,
            replyToId: req.body.replyToId,
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
        include: {
            user: true,
            favorities: true,
            replyFrom: true,
        },
    });
    if (!tweet) {
        throw Error('updateTweetでtweetが存在してないっぽいよ');
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
                numberOfFavorite: { increment: 1 },
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
                numberOfFavorite: { decrement: 1 },
            },
        });
    }
    const updatedTweet = await prisma.tweet.findUnique({
        where: {
            id: req.body.tweet.id,
        },
        include: {
            user: true,
            favorities: true,
            replyFrom: true,
        },
    });

    res.status(200).json(updatedTweet);
};

export const getNotifications = async (req: Request, res: Response) => {
    // リプライを取得
    const replyNotifications = await prisma.tweet.findMany({
        where: { replyTo: { createdBy: req.user.id } },
        include: { user: true, replyFrom: true },
    });

    // favを取得
    const favoriteNotifications = await prisma.favorite.findMany({
        where: { tweet: { createdBy: req.user.id } },
        include: { tweet: { include: { user: true } }, user: true },
    });

    const notifications: Array<(Favorite & { user: User; tweet: Tweet & { user: User } }) | (Tweet & { user: User })> =
        [...favoriteNotifications, ...replyNotifications];

    const sortedNotifications = notifications.sort(function (a, b) {
        if (a.createdAt > b.createdAt) {
            return -1;
        } else {
            return 1;
        }
    });
    res.json(sortedNotifications);
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

// 指定されたユーザーのフォローしているユーザー
export const getFollowings = async (req: Request, res: Response) => {
    const requestUser = await prisma.user.findUnique({
        where: { username: req.params.username },
        include: { following: true },
    });
    if (!requestUser) {
        throw Error('getFollowingでrequestUserが存在してないっぽいよ');
    }

    res.json(requestUser.following);
};

// 指定されたユーザーのフォロワー
export const getFollowers = async (req: Request, res: Response) => {
    const requestUser = await prisma.user.findUnique({
        where: { username: req.params.username },
        include: { followedBy: true },
    });
    if (!requestUser) {
        throw Error('getFollowingでrequestUserが存在してないっぽいよ');
    }
    res.json(requestUser.followedBy);
};

export const updateFollowings = async (req: Request, res: Response) => {
    const userToEdit: User | null = await prisma.user.findUnique({
        where: { username: req.body.followingUsername },
    });

    if (!userToEdit) {
        throw Error('updateFollowingsでuserToEditが存在してないっぽいよ');
    }
    await prisma.user.update({
        where: { username: req.user.username },
        data: {
            following:
                req.body.action === 'follow'
                    ? { connect: [{ id: userToEdit.id }] }
                    : { disconnect: [{ id: userToEdit.id }] },
        },
    });
    res.status(200);
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
    if (!user) {
        throw Error('getFollowingでrequestUserが存在してないっぽいよ');
    } else if (user.password === hashedInputPassword) {
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
