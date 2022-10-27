import { Request } from 'express';

export type ProfileType = {
    id: number;
    username: string;
    icon: string;
    header: string;
    introduction: string;
    email: string;
    birthday: string;
    password: string;
};

export type TweetType = {
    id: number;
    createdBy: number;
    replyTo: null | number;
    content: string;
    createdAt: Date;
    user?: ProfileType;
    numberOfFavorite?: number;
    numberOfReply?: number;
    favoriteNotification?: FavoriteType;
};

export type FavoriteType = {
    id: number;
    tweetId: number;
    userId: number;
    createdAt: Date;
    user?: ProfileType;
};

export type FollowerType = {
    id: number;
    to: number;
    from: number;
    createdAt: Date;
    user?: ProfileType;
};

export type AuthedRequest = Request & {
    user: ProfileType;
};
