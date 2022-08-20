import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useCallApi from './utils/api';
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

const tabValues = ['followings', 'followers'] as const;
type TabValue = typeof tabValues[number];

type FollowProps = {
  myProfile: ProfileType | undefined;
  tabValue: TabValue;
};

const Follow: React.FC<FollowProps> = (props) => {
  const callApi = useCallApi();
  const params = useParams();
  const navigate = useNavigate();
  const [followingsList, setFollowingsList] = useState<Array<FollowerType>>([]);
  const [followersList, setFollowersList] = useState<Array<FollowerType>>([]);
  const [myFollowingsList, setMyFollowingsList] = useState<Array<FollowerType>>([]);

  const handleChange = (event: React.SyntheticEvent, newTabIndex: number) => {
    const newTabValue = tabValues[newTabIndex];
    if (newTabValue !== props.tabValue) {
      navigate(`/${params.username}/${newTabValue}`);
    }
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
            <Tab label="フォロー中" />
            <Tab label="フォロワー" />
          </Tabs>
        </Box>
        <TabPanel currentValue={props.tabValue} tabValue={'followings'}>
          {followingsList.length ? (
            <List sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}>
              {followingsList.map((user, index) => (
                <ListItem key={index} alignItems="flex-start">
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <Link to={'/' + user.user.username}>
                          <Stack direction="row" spacing={2}>
                            <Avatar alt={user.user.username} src={user.user.icon} />
                            <p>{user.user.username}</p>
                            {props.myProfile?.username === user.user.username ? null : followingsList.find(
                                (followingUser) => followingUser.followedUserId === props.myProfile?.id
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
        </TabPanel>
        <TabPanel currentValue={props.tabValue} tabValue={'followers'}>
          {followersList.length ? (
            <List sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}>
              {followersList.map((user, index) => (
                <ListItem key={index} alignItems="flex-start">
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <Link to={'/' + user.user.username}>
                          <Stack direction="row" spacing={2}>
                            <Avatar alt={user.user.username} src={user.user.icon} />
                            <p>{user.user.username}</p>
                            {props.myProfile?.username === user.user.username ? null : myFollowingsList.find(
                                (myFollowingUser) => myFollowingUser.userIdBeingFollowed === user.followedUserId
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
        </TabPanel>
      </Box>
    </>
  );
};

export default Follow;
