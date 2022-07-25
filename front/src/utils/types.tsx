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
    ownerId: number;
    content: string;
    createdAt: Date;
    user: ProfileType;
    numberOfFavorite: number;
    isFavorite: boolean;
};
