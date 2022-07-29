export type ProfileType = {
    id: number;
    username: string;
    icon: string;
    header: string;
    introduction: string;
    email: string;
    birthday: string;
};

export type TweetType = {
    id: number;
    createdBy: number;
    replyTo: null | number;
    content: string;
    createdAt: Date;
    user: ProfileType;
    numberOfReply: number;
    numberOfFavorite: number;
    isFavorite: boolean;
    favoriteNotification: FavoriteType;
};

export type FavoriteType = {
    id: number;
    tweetId: number;
    userId: number;
    createdAt: string;
    user: ProfileType;
};

export type FollowerType = {
    id: number;
    userIdBeingFollowed: number;
    followedUserId: number;
    createdAt: string;
    user: ProfileType;
};
