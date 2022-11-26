import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCallApi } from './utils/api';
import { ProfileType } from './utils/types';

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

type TabValue = 'followings' | 'followers';
type FollowProps = { myProfile: ProfileType | undefined; tabValue: TabValue };

const Follow: React.FC<FollowProps> = (props) => {
    const callApi = useCallApi();
    const params = useParams();
    const navigate = useNavigate();
    const [followingsList, setFollowingsList] = useState<Array<ProfileType>>([]);
    const [followersList, setFollowersList] = useState<Array<ProfileType>>([]);
    const [myFollowingsList, setMyFollowingsList] = useState<Array<ProfileType>>([]);
    // タブのためのstate
    const handleChange = (event: React.SyntheticEvent, newTabValue: TabValue) => {
        if (newTabValue !== props.tabValue) {
            navigate(`/${params.username}/${newTabValue}`);
        }
    };

    useEffect(() => {
        getMyFollowings()?.then(setMyFollowingsList);
        getFollowings()?.then(setFollowingsList);
        getFollowers()?.then(setFollowersList);
    }, []);

    function getFollowings(): Promise<Array<ProfileType>> | undefined {
        return callApi('/' + params.username + '/followings');
    }

    function getFollowers(): Promise<Array<ProfileType>> | undefined {
        return callApi('/' + params.username + '/followers');
    }

    function getMyFollowings(): Promise<Array<ProfileType>> | undefined {
        return callApi('/' + props.myProfile?.username + '/followings');
    }

    function updateFollowings(username: string, action: 'follow' | 'unFollow'): void {
        callApi('/updateFollowings', {
            method: 'PATCH',
            body: JSON.stringify({ followings: followingsList, followingUsername: username, action: action }),
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
        currentValue: TabValue;
        tabValue: TabValue;
    }

    function TabPanel(props: TabPanelProps) {
        const { children, currentValue, tabValue, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={currentValue !== tabValue}
                id={`simple-tabpanel-${tabValue}`}
                aria-labelledby={`simple-tab-${tabValue}`}
                {...other}
            >
                {currentValue === tabValue && (
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
                    <Tabs value={props.tabValue} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="フォロー中" value="followings" />
                        <Tab label="フォロワー" value="followers" />
                    </Tabs>
                </Box>
                <TabPanel currentValue={props.tabValue} tabValue={'followings'}>
                    <FollowersList
                        followers={followingsList}
                        onUpdateFollowings={updateFollowings}
                        myProfile={props.myProfile}
                        myFollowings={myFollowingsList}
                    />
                </TabPanel>
                <TabPanel currentValue={props.tabValue} tabValue={'followers'}>
                    <FollowersList
                        followers={followersList}
                        onUpdateFollowings={updateFollowings}
                        myProfile={props.myProfile}
                        myFollowings={myFollowingsList}
                    />
                </TabPanel>
            </Box>
        </>
    );
};

type FollowersListProps = {
    followers: ProfileType[];
    onUpdateFollowings: (username: string, action: 'follow' | 'unFollow') => void;
    myProfile?: ProfileType;
    myFollowings: ProfileType[];
};

const FollowersList: React.FC<FollowersListProps> = (props) => {
    return (
        <>
            {props.followers.length ? (
                <List sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}>
                    {props.followers.map((user, index) => (
                        <ListItem key={index} alignItems="flex-start">
                            <ListItemText
                                primary={
                                    <>
                                        <Link to={'/' + user.username}>
                                            <Stack direction="row" spacing={2}>
                                                <>
                                                    <Avatar alt={user.username} src={user.icon} />
                                                    <p>{user.username}</p>
                                                    {props.myProfile?.username ===
                                                    user.username ? null : props.myFollowings.find(
                                                          (myFollowing) => myFollowing.id === user.id
                                                      ) ? (
                                                        <Button
                                                            size="small"
                                                            onClick={(e) => {
                                                                props.onUpdateFollowings(user.username, 'unFollow');
                                                                e.preventDefault();
                                                            }}
                                                        >
                                                            フォロー解除
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="small"
                                                            onClick={(e) => {
                                                                props.onUpdateFollowings(user.username, 'follow');
                                                                e.preventDefault();
                                                            }}
                                                        >
                                                            フォロー
                                                        </Button>
                                                    )}
                                                </>
                                            </Stack>
                                        </Link>
                                    </>
                                }
                                secondary={<>{user.introduction}</>}
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
