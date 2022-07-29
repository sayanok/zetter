import React, { useState, useEffect, SetStateAction } from 'react';
import { useLocation, Link } from 'react-router-dom';
import useCallApi from './utils/api';
import { FollowerType } from './utils/types';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

const Follow: React.FC = () => {
    const callApi = useCallApi();
    const location = useLocation();
    const [usersList, setUsersList] = useState<Array<FollowerType>>([]);
    // タブのためのstate
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        location.pathname === '/followings' ? getFollowings()?.then(setUsersList) : getFollowers()?.then(setUsersList);
    }, [location]);

    function getFollowings(): Promise<Array<FollowerType>> | undefined {
        return callApi('http://localhost:5000/api/zetter/followings');
    }

    function getFollowers(): Promise<Array<FollowerType>> | undefined {
        return callApi('http://localhost:5000/api/zetter/followers');
    }

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    {/* 修正の必要あり */}
                    <Link to="/followings">
                        <Tab label="フォロー中" />
                    </Link>
                    <Link to="/followers">
                        <Tab label="フォロワー" />
                    </Link>
                </Tabs>
            </Box>
            {usersList.length ? (
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
            ) : (
                <p>やーいぼっち！</p>
            )}
        </>
    );
};

export default Follow;
