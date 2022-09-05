import React from 'react';
import { Link } from 'react-router-dom';
import { TweetType } from './utils/types';
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
            <Link to={'/tweet/' + props.tweet.id}>
                <ListItemAvatar>
                    <Avatar alt={props.tweet.user.username} src={props.tweet.user.icon} />
                </ListItemAvatar>
                <ListItemText
                    primary={<>{props.tweet.user.username + '・' + formatDate(props.tweet.createdAt)}</>}
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
                                    isFavorite={props.tweet.isFavorite}
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
