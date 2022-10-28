import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCallApi } from './utils/api';
import { ProfileType, TweetType } from './utils/types';
import TweetTrees from './TweetTrees';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

type ProfilePageProps = { myProfile: ProfileType | undefined };

const ProfilePage: React.FC<ProfilePageProps> = (props) => {
    const callApi = useCallApi();
    const params = useParams();
    const [profile, setProfile] = useState<ProfileType>();
    const [tweetsListOfSpecificUser, setTweetsListOfSpecificUser] = useState<Array<TweetType>>([]);
    const [favoriteTweetList, setFavoriteTweetList] = useState<Array<TweetType>>([]);
    const [followingsNumber, setFollowingsNumber] = useState<number>();
    const [followersNumber, setFollowersNumber] = useState<number>();
    const [followings, setFollowings] = useState<Array<ProfileType>>();
    const [followers, setFollowers] = useState<Array<ProfileType>>();
    // タブ関連のstate
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        getProfile()?.then(setProfile);
        getAndSetTweetsListOfSpecificUser();
        getAndSetFavoriteTweetList();
        getFollowings()?.then((data) => {
            setFollowings(data);
            setFollowingsNumber(data.length);
        });
        getFollowers()?.then((data) => {
            setFollowers(data);
            setFollowersNumber(data.length);
        });
    }, [params.username, value]);

    function getProfile(): Promise<ProfileType> | undefined {
        return callApi('http://localhost:5000/api/zetter/profile/' + params.username);
    }

    function getSpecificUsersTweets(): Promise<Array<TweetType>> | undefined {
        return callApi('http://localhost:5000/api/zetter/specificUsersTweets/' + params.username);
    }

    function getFavoriteTweets(): Promise<Array<TweetType>> | undefined {
        return callApi('http://localhost:5000/api/zetter/specificUsersFavoriteTweets/' + params.username);
    }

    function getAndSetTweetsListOfSpecificUser(): void {
        getSpecificUsersTweets()?.then(setTweetsListOfSpecificUser);
    }

    function getAndSetFavoriteTweetList(): void {
        getFavoriteTweets()?.then(setFavoriteTweetList);
    }

    function getFollowings(): Promise<Array<ProfileType>> | undefined {
        return callApi('http://localhost:5000/api/zetter/' + params.username + '/followings');
    }

    function getFollowers(): Promise<Array<ProfileType>> | undefined {
        return callApi('http://localhost:5000/api/zetter/' + params.username + '/followers');
    }

    function updateFollowings(order: string): void {
        callApi('http://localhost:5000/api/zetter/updateFollowings', {
            method: 'PATCH',
            body: JSON.stringify({ followings: followings, followingUsername: params.username, order: order }),
        });
        afterUpdateFollowings();
    }

    function afterUpdateFollowings(): void {
        getFollowers()?.then((data) => {
            setFollowers(data);
            setFollowersNumber(data.length);
        });
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

    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    return profile && props.myProfile ? (
        <>
            <Card sx={{ maxWidth: 500 }}>
                <CardMedia component="img" height="200" image={profile.header} alt={profile.username} />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {profile.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {profile.introduction}
                        <br />
                        誕生日：{profile.birthday}
                        <br />
                        <Link to={'/' + profile.username + '/followings'}>
                            <>フォロー中: {followingsNumber}人</>
                        </Link>
                        <Link to={'/' + profile.username + '/followers'}>
                            <>フォロワー: {followersNumber}人</>
                        </Link>
                    </Typography>
                </CardContent>
                {props.myProfile.id === profile.id ? (
                    <CardActions>
                        <Button size="small">
                            <Link to={'/settings/' + profile.username}>編集する</Link>
                        </Button>
                    </CardActions>
                ) : (
                    <CardActions>
                        <>{console.log(followers)}</>
                        {followers?.find((follower) => follower.username === props.myProfile?.username) ? (
                            <Button
                                size="small"
                                onClick={() => {
                                    updateFollowings('unFollow');
                                }}
                            >
                                フォローを解除する
                            </Button>
                        ) : (
                            <Button
                                size="small"
                                onClick={() => {
                                    updateFollowings('follow');
                                }}
                            >
                                フォローする
                            </Button>
                        )}
                    </CardActions>
                )}
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="ツイート" {...a11yProps(0)} />
                            <Tab label="いいね" {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <TweetTrees
                            tweetsList={tweetsListOfSpecificUser}
                            setTweets={setTweetsListOfSpecificUser}
                            afterPostTweet={getAndSetTweetsListOfSpecificUser}
                        />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <TweetTrees
                            tweetsList={favoriteTweetList}
                            setTweets={setFavoriteTweetList}
                            afterPostTweet={getAndSetFavoriteTweetList}
                        />
                    </TabPanel>
                </Box>
            </Card>
        </>
    ) : null;
};

export default ProfilePage;
