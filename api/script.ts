import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.createMany({
        data: [
            {
                username: 'mupi',
                icon: 'http://localhost:5000/avatars/mupi.jpg',
                header: 'http://localhost:5000/headers/mupiheader.jpeg',
                password: '32HwN/80tyAeS3R+4I32BIGhVjblfWdxL79VfKtsnfc=',
                email: 'mupi@example.com',
                introduction: 'むーちゃんだよ',
                birthday: new Date(1991, 7, 4),
            },
            {
                username: 'mipi',
                header: 'http://localhost:5000/headers/mipiheader.jpeg',
                icon: 'http://localhost:5000/avatars/mipi.jpg',
                password: 'OGQmpwfD/lBk8rCNTdJbOar2PqfUstFF3lEat3z3Cic=',
                email: 'mipi@example.cpm',
                introduction: 'ロン！！',
                birthday: new Date(1991, 9, 24),
            },
            {
                username: 'zepi',
                header: 'http://localhost:5000/headers/zepiheader.png',
                icon: 'http://localhost:5000/avatars/zepi.jpg',
                password: 'RFwA1n7ucYA3PJRjv7jVoPC4cvb2nP2eEIDU8fjNyY0=',
                email: 'zepi@example.com',
                introduction: 'あーうううﾒﾝﾒﾝﾒﾝﾒｰｰﾝ...ばぶ',
                birthday: new Date(2022, 1, 14),
            },
            {
                username: 'oball',
                password: 'RFwA1n7ucYA3PJRjv7jVoPC4cvb2nP2eEIDU8fjNyY0=',
                email: 'oball@example.com',
                introduction: 'いつも然に投げられてるよ',
                birthday: new Date(2022, 1, 14),
            },
            {
                username: 'bouncer',
                password: 'RFwA1n7ucYA3PJRjv7jVoPC4cvb2nP2eEIDU8fjNyY0=',
                email: 'bbb@example.com',
                introduction: 'いつも然にバウンバウンされてるよ',
                birthday: new Date(2022, 1, 14),
            },
            {
                username: 'kasyakasya',
                password: 'RFwA1n7ucYA3PJRjv7jVoPC4cvb2nP2eEIDU8fjNyY0=',
                email: 'kasha@example.com',
                introduction: 'ｶｼｬ...ｶｼｬｶｼｬ...',
                birthday: new Date(2022, 1, 14),
            },
            {
                username: 'gauze',
                password: 'RFwA1n7ucYA3PJRjv7jVoPC4cvb2nP2eEIDU8fjNyY0=',
                email: 'ggg@example.com',
                introduction: 'ひらひらふわふわびちゃびちゃ',
                birthday: new Date(2022, 1, 14),
            },
            {
                username: 'ベビージム',
                password: 'RFwA1n7ucYA3PJRjv7jVoPC4cvb2nP2eEIDU8fjNyY0=',
                email: 'gym@example.com',
                introduction: 'また然に脱走された...!',
                birthday: new Date(2022, 1, 14),
            },
        ],
    });
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
