import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TweetType, ProfileType } from './utils/types';
import { useCallApi } from './utils/api';
import ReplyButton from './ReplyButton';
import FavButton from './FavButton';
import dayjs from 'dayjs';
import './SingleTweet.css';

import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import IosShareIcon from '@mui/icons-material/IosShare';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Button from '@mui/material/Button';

type SingleTweetProps = {
    tweet: TweetType;
    afterPostTweet: () => void;
    updateFavoriteState: (tweet: TweetType) => void;
};

const SingleTweet: React.FC<SingleTweetProps> = (props) => {
    const callApi = useCallApi();
    const userIds: Array<number | undefined> = props.tweet.favorities
        ? props.tweet.favorities.map((favorite) => favorite.userId)
        : [];
    const [myProfile, setMyProfile] = useState<ProfileType>();

    useEffect(() => {
        getMyProfile()?.then(setMyProfile);
    }, []);

    function getMyProfile(): Promise<ProfileType> | undefined {
        return callApi('/profile');
    }

    function formatDate(createdAt: Date): string {
        const now: dayjs.Dayjs = dayjs();
        if (dayjs(createdAt).isBefore(now.subtract(1, 'd'))) {
            return dayjs(createdAt).format('M月DD日');
        } else {
            return String(now.diff(createdAt, 'hour')) + '時間前';
        }
    }

    return (
        <>
            <Link to={'/' + props.tweet.user.username}>
                <ListItemAvatar>
                    <Avatar alt={props.tweet.user.username} src={props.tweet.user.icon} />
                </ListItemAvatar>
            </Link>
            <Link to={'/tweet/' + props.tweet.id}>
                <ListItemText
                    primary={
                        <>
                            <Link to={'/' + props.tweet.user.username}>{props.tweet.user.username}</Link>
                            <br />
                            {formatDate(props.tweet.createdAt)}
                        </>
                    }
                    secondary={
                        <>
                            {props.tweet.content}
                            <br />
                            <ListItemIcon>
                                <ReplyButton tweet={props.tweet} afterPostTweet={() => props.afterPostTweet()} />
                                <Button variant="text">
                                    <CompareArrowsIcon />
                                </Button>
                                <FavButton
                                    numberOfFavorite={props.tweet.numberOfFavorite}
                                    isFavorite={(props.tweet.isFavorite = userIds.includes(myProfile?.id))}
                                    onClick={() => props.updateFavoriteState(props.tweet)}
                                />
                                <Button variant="text">
                                    <IosShareIcon />
                                </Button>
                            </ListItemIcon>
                            <Divider />
                        </>
                    }
                />
            </Link>
        </>
    );
};
export default SingleTweet;
