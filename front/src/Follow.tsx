import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import useCallApi from './utils/api';
import { FollowerType } from './utils/types';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';

const Follow: React.FC = () => {
    const callApi = useCallApi();
    const location = useLocation();
    const [usersList, setUsersList] = useState<Array<FollowerType>>([]);

    useEffect(() => {
        location.pathname === '/followings' ? getFollowings()?.then(setUsersList) : getFollowers()?.then(setUsersList);
    }, []);

    function getFollowings(): Promise<Array<FollowerType>> | undefined {
        console.log('followings');
        return callApi('http://localhost:5000/api/zetter/followings');
    }

    function getFollowers(): Promise<Array<FollowerType>> | undefined {
        console.log('followers');
        return callApi('http://localhost:5000/api/zetter/followers');
    }

    return (
        <>
            <List sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}>
                {usersList.map((user, index) => (
                    <ListItem key={index} alignItems="flex-start">
                        <ListItemText
                            primary={
                                <React.Fragment>
                                    <Link to={'/' + user.user.username}>
                                        <Stack direction="row" spacing={2}>
                                            <Avatar alt={user.user.username} src={user.user.icon} />
                                            <p>{user.user.username}</p>
                                        </Stack>
                                    </Link>
                                </React.Fragment>
                            }
                            secondary={<React.Fragment>{user.user.introduction}</React.Fragment>}
                        />
                    </ListItem>
                ))}
            </List>
        </>
    );
};

export default Follow;
