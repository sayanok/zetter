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
    content: string;
    replyToId: null | number;
    replyFrom: Array<Number>;
    createdAt: Date;
    user: ProfileType;
    numberOfFavorite: number;
    isFavorite: boolean;
    favoriteNotification: FavoriteType;
    favorities: Array<FavoriteType>;
};

export type FavoriteType = {
    id: number;
    tweetId: number;
    userId: number;
    createdAt: string;
    user: ProfileType;
    tweet: TweetType;
};
