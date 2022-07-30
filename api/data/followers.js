let followers = [
    { id: 1, userIdBeingFollowed: 3, followedUserId: 1, createdAt: new Date() },
    { id: 2, userIdBeingFollowed: 3, followedUserId: 2, createdAt: new Date() },
    { id: 3, userIdBeingFollowed: 3, followedUserId: 4, createdAt: new Date() },
    { id: 4, userIdBeingFollowed: 1, followedUserId: 3, createdAt: new Date() },
    { id: 5, userIdBeingFollowed: 2, followedUserId: 3, createdAt: new Date() },
    { id: 6, userIdBeingFollowed: 3, followedUserId: 6, createdAt: new Date() },
    { id: 7, userIdBeingFollowed: 3, followedUserId: 7, createdAt: new Date() },
];
// 日本語で書いてもややこしいけど
// userIdBeingFollowed: フォローされている人
// followedUserId: フォローしている人
module.exports = followers;
