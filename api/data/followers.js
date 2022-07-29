let followers = [
    { id: 1, userIdBeingFollowed: 3, followedUserId: 1, createdAt: new Date() },
    { id: 2, userIdBeingFollowed: 3, followedUserId: 2, createdAt: new Date() },
];
// 日本語で書いてもややこしいけど
// userIdBeingFollowed: フォローされている人
// followedUserId: フォローしている人
module.exports = followers;
