import React from 'react';
import { Link } from 'react-router-dom';
import { TweetType } from './utils/types';
import ReplyButton from './ReplyButton';
import FavButton from './FavButton';

import Avatar from '@mui/material/Avatar';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import IosShareIcon from '@mui/icons-material/IosShare';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Button from '@mui/material/Button';
import StarIcon from '@mui/icons-material/Star';

type FavoriteNotificationProps = {
    tweet: TweetType;
    afterPostTweet: () => void;
    updateFavoriteState: (tweet: TweetType) => void;
};

const FavoriteNotification: React.FC<FavoriteNotificationProps> = (props) => {
    return (
        <>
            <Link to={'/tweet/' + props.tweet.id}>
                <ListItemText
                    primary={
                        <React.Fragment>
                            <Link to={'/' + props.tweet.favoriteNotification.user.username}>
                                <ListItemIcon>
                                    <StarIcon color="primary" fontSize="large" />
                                    <Avatar
                                        alt={props.tweet.favoriteNotification.user.username}
                                        src={props.tweet.favoriteNotification.user.icon}
                                    />
                                </ListItemIcon>
                                <p>
                                    {props.tweet.favoriteNotification.user.username}
                                    さんがあなたのツイートをいいねしました
                                </p>
                            </Link>
                        </React.Fragment>
                    }
                    secondary={
                        <React.Fragment>
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
                        </React.Fragment>
                    }
                />
            </Link>
        </>
    );
};

export default FavoriteNotification;
