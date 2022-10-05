import { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import {
    getTweets,
    getSpecificUsersTweets,
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
import users from '../data/users';

const router = Router();

router.get('/', auth, getTweets);
router.get('/specificUsersTweets/:username', auth, getSpecificUsersTweets);

router.get('/notifications', auth, getNotifications);

router.get('/profile', auth, getMyProfile);
router.get('/profile/:username', auth, getProfile);
router.patch('/profile', auth, updateProfile);

router.get('/:username/followings', auth, getFollowings);
router.get('/:username/followers', auth, getFollowers);
router.patch('/updateFollowings', auth, updateFollowings);

router.post('/login', login);

function auth(req: Request, res: Response, next: NextFunction) {
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

    const user = users.find(({ id }) => id === verifyUser.userId);
    if (user) {
        req.user = user;
        next();
    } else {
        res.status(401).end();
        return;
    }
}

//

export default router;
