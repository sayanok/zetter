let followers = [
    { id: 1, to: 3, from: 1, createdAt: new Date() },
    { id: 2, to: 3, from: 2, createdAt: new Date() },
    { id: 3, to: 3, from: 4, createdAt: new Date() },
    { id: 4, to: 1, from: 3, createdAt: new Date() },
    { id: 5, to: 2, from: 3, createdAt: new Date() },
    { id: 6, to: 3, from: 6, createdAt: new Date() },
    { id: 7, to: 3, from: 7, createdAt: new Date() },
];
// to: フォローされている人
// from: フォローしている人
module.exports = followers;
