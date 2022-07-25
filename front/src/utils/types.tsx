export type ProfileType = {
    id: number;
    username: string;
    icon: string;
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
};
