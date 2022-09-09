import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCallApi } from './utils/api';
import { FollowerType, ProfileType } from './utils/types';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

type FollowProps = { myProfile: ProfileType | undefined };

const Follow: React.FC<FollowProps> = (props) => {
    const callApi = useCallApi();
    const params = useParams();
    const [followingsList, setFollowingsList] = useState<Array<FollowerType>>([]);
    const [followersList, setFollowersList] = useState<Array<FollowerType>>([]);
    const [myFollowingsList, setMyFollowingsList] = useState<Array<FollowerType>>([]);
    // タブのためのstate
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        getMyFollowings()?.then(setMyFollowingsList);
        getFollowings()?.then(setFollowingsList);
        getFollowers()?.then(setFollowersList);
        // }, [location]);
    }, []);

    function getFollowings(): Promise<Array<FollowerType>> | undefined {
        return callApi('http://localhost:5000/api/zetter/' + params.username + '/followings');
    }

    function getFollowers(): Promise<Array<FollowerType>> | undefined {
        return callApi('http://localhost:5000/api/zetter/' + params.username + '/followers');
    }

    function getMyFollowings(): Promise<Array<FollowerType>> | undefined {
        return callApi('http://localhost:5000/api/zetter/' + props.myProfile?.username + '/followings');
    }

    function updateFollowings(username: string, order: string): void {
        callApi('http://localhost:5000/api/zetter/updateFollowings', {
            method: 'PATCH',
            body: JSON.stringify({ followings: followingsList, followingUsername: username, order: order }),
        });
        afterUpdateFollowings();
    }

    function afterUpdateFollowings(): void {
        getFollowings()?.then(setFollowingsList);
        getMyFollowings()?.then(setMyFollowingsList);
    }

    // タブ関連のメソッドなど
    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: number;
    }

    function TabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        {/* 修正の必要あり */}
                        <Tab
                            label="フォロー中"
                            //    href={'/' + params.username + '/followings'}
                            //     onChange={(e) => {
                            //         e.preventDefault();
                            //     }}
                        />
                        <Tab
                            label="フォロワー"
                            //     href={'/' + params.username + '/followers'}
                            //     onChange={(e) => {
                            //         e.preventDefault();
                            //     }}
                        />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    {followingsList.length ? (
                        <List sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}>
                            {followingsList.map((user, index) => (
                                <ListItem key={index} alignItems="flex-start">
                                    <ListItemText
                                        primary={
                                            <>
                                                <Link to={'/' + user.user.username}>
                                                    <Stack direction="row" spacing={2}>
                                                        <Avatar alt={user.user.username} src={user.user.icon} />
                                                        <p>{user.user.username}</p>
                                                        {props.myProfile?.username ===
                                                        user.user.username ? null : followingsList.find(
                                                              (followingUser) =>
                                                                  followingUser.from === props.myProfile?.id
                                                          ) ? (
                                                            <Button
                                                                size="small"
                                                                onClick={(e) => {
                                                                    updateFollowings(user.user.username, 'unFollow');
                                                                    e.preventDefault();
                                                                }}
                                                            >
                                                                フォロー解除
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                size="small"
                                                                onClick={(e) => {
                                                                    updateFollowings(user.user.username, 'follow');
                                                                    e.preventDefault();
                                                                }}
                                                            >
                                                                フォロー
                                                            </Button>
                                                        )}
                                                    </Stack>
                                                </Link>
                                            </>
                                        }
                                        secondary={<>{user.user.introduction}</>}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <p>やーいぼっち！</p>
                    )}
                </TabPanel>
                <TabPanel value={value} index={1}>
                    {followersList.length ? (
                        <List sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}>
                            {followersList.map((user, index) => (
                                <ListItem key={index} alignItems="flex-start">
                                    <ListItemText
                                        primary={
                                            <>
                                                <Link to={'/' + user.user.username}>
                                                    <Stack direction="row" spacing={2}>
                                                        <Avatar alt={user.user.username} src={user.user.icon} />
                                                        <p>{user.user.username}</p>
                                                        {props.myProfile?.username ===
                                                        user.user.username ? null : myFollowingsList.find(
                                                              (myFollowingUser) => myFollowingUser.to === user.from
                                                          ) ? (
                                                            <Button
                                                                size="small"
                                                                onClick={(e) => {
                                                                    updateFollowings(user.user.username, 'unFollow');
                                                                    e.preventDefault();
                                                                }}
                                                            >
                                                                フォロー解除
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                size="small"
                                                                onClick={(e) => {
                                                                    updateFollowings(user.user.username, 'follow');
                                                                    e.preventDefault();
                                                                }}
                                                            >
                                                                フォロー
                                                            </Button>
                                                        )}
                                                    </Stack>
                                                </Link>
                                            </>
                                        }
                                        secondary={<>{user.user.introduction}</>}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <p>やーいぼっち！</p>
                    )}
                </TabPanel>
            </Box>
        </>
    );
};

export default Follow;
