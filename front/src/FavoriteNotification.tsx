import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TweetType, ProfileType, FavoriteType } from './utils/types';
import { useCallApi } from './utils/api';
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
    favorite: FavoriteType;
    afterPostTweet: () => void;
    updateFavoriteState: (tweet: TweetType) => void;
};

const FavoriteNotification: React.FC<FavoriteNotificationProps> = (props) => {
    const callApi = useCallApi();
    const [myProfile, setMyProfile] = useState<ProfileType>();

    useEffect(() => {
        getMyProfile()?.then(setMyProfile);
    }, []);

    function getMyProfile(): Promise<ProfileType> | undefined {
        return callApi('http://localhost:5000/api/zetter/profile');
    }

    return (
        <>
            <Link to={'/tweet/' + props.favorite.id}>
                <ListItemText
                    primary={
                        <>
                            <Link to={'/' + props.favorite.user.username}>
                                <ListItemIcon>
                                    <StarIcon color="primary" fontSize="large" />
                                    <Avatar alt={props.favorite.user.username} src={props.favorite.user.icon} />
                                </ListItemIcon>
                                <p>
                                    {props.favorite.user.username}
                                    さんがあなたのツイートをいいねしました
                                </p>
                            </Link>
                        </>
                    }
                    secondary={
                        <>
                            {props.favorite.tweet.content}
                            <br />
                            <ListItemIcon>
                                <ReplyButton
                                    tweet={props.favorite.tweet}
                                    afterPostTweet={() => props.afterPostTweet()}
                                />
                                <Button variant="text">
                                    <CompareArrowsIcon />
                                </Button>
                                <FavButton
                                    numberOfFavorite={props.favorite.tweet.numberOfFavorite}
                                    isFavorite={props.favorite.userId === myProfile?.id}
                                    onClick={() => props.updateFavoriteState(props.favorite.tweet)}
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

export default FavoriteNotification;
