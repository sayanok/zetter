import { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import {
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
} from '../controllers/zetter';
import { JwtPayload, verify } from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { User } from '@prisma/client';

const router = Router();

router.get('/', auth, getTweets);
router.get('/specificUsersTweets/:username', auth, getSpecificUsersTweets);
router.get('/specificUsersFavoriteTweets/:username', auth, getSpecificUsersFavoriteTweets);
router.get('/tweet/:tweetId', auth, getTweet);
router.get('/replys/:tweetId', auth, getReplys);
router.post('/', auth, createTweet);
router.patch('/', auth, updateTweet);

router.get('/notifications', auth, getNotifications);

router.get('/profile', auth, getMyProfile);
router.get('/profile/:username', auth, getProfile);
router.patch('/profile', auth, updateProfile);

router.get('/:username/followings', auth, getFollowings);
router.get('/:username/followers', auth, getFollowers);
router.patch('/updateFollowings', auth, updateFollowings);

router.post('/login', login);

async function auth(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization || !process.env.SECRET_KEY) {
        res.status(401).end();
        return;
    }
    const authorization: string = req.headers.authorization;
    const token: string = authorization.replace('Bearer ', '');
    let verifyUser: JwtPayload;
    try {
        verifyUser = verify(token, process.env.SECRET_KEY) as JwtPayload;
    } catch (error) {
        res.status(401).end();
        // TODO: verify失敗理由によってかき分ける
        return;
    }

    try {
        const user: User | null = await prisma.user.findUnique({
            where: {
                id: verifyUser.userId,
            },
            include: { following: true },
        });
        if (user) {
            req.user = user;
            next();
        } else {
            res.status(401).end();
            return;
        }
    } catch (error) {
        res.status(500).json('findUnque失敗したよ');
    }
}

//

export default router;
