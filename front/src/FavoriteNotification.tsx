import React from 'react';
import { Link } from 'react-router-dom';
import { TweetType, ProfileType, FavoriteType } from './utils/types';
import { useCallApi } from './utils/api';

import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import StarIcon from '@mui/icons-material/Star';

type FavoriteNotificationProps = {
    favorite: FavoriteType;
    afterPostTweet: () => void;
    updateFavoriteState: (tweet: TweetType) => void;
};

const FavoriteNotification: React.FC<FavoriteNotificationProps> = (props) => {
    const callApi = useCallApi();

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
                            <Divider />
                        </>
                    }
                />
            </Link>
        </>
    );
};

export default FavoriteNotification;
