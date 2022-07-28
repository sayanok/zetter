import React, { useState, useEffect } from 'react';
import useCallApi from './utils/api';
import { TweetType } from './utils/types';
import TweetTree from './TweetTree';
import FavoriteNotification from './FavoriteNotification';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Notifications: React.FC = () => {
    const [notificationsList, setNotifications] = useState<Array<TweetType>>([]);
    const callApi = useCallApi();
    // タブ関連のstate
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        getTweets()?.then(setNotifications);
    }, []);

    function getTweets(): Promise<Array<TweetType>> | undefined {
        return callApi('http://localhost:5000/api/zetter/notifications');
    }

    function updateFavoriteState(tweet: TweetType): void {
        if (tweet.isFavorite) {
            // favから削除する
            callApi('http://localhost:5000/api/zetter', {
                method: 'PATCH',
                body: JSON.stringify({ tweet: tweet, order: 'delete' }),
            })?.then((data) => {
                let result = notificationsList.map(function (value: TweetType): TweetType {
                    if (tweet.id === value.id) {
                        return data;
                    } else {
                        return value;
                    }
                });
                setNotifications(result);
            });
        } else {
            // favに追加する
            callApi('http://localhost:5000/api/zetter', {
                method: 'PATCH',
                body: JSON.stringify({ tweet: tweet, order: 'add' }),
            })?.then((data) => {
                let result = notificationsList.map(function (value: TweetType): TweetType {
                    if (tweet.id === value.id) {
                        return data;
                    } else {
                        return value;
                    }
                });
                setNotifications(result);
            });
        }
    }

    function getAndSetTweets(): void {
        getTweets()?.then(setNotifications);
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
            {/* 今の実装だと、最新の10件しか表示されてない
            今まで表示してる10件＋最新のn件のツイートを取得する方法を検討する必要がある */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="すべて" />
                    <Tab label="@ツイート" />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <List sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}>
                    {notificationsList.map((tweet: TweetType, index) => (
                        <ListItem key={index} alignItems="flex-start">
                            {'favoriteNotification' in tweet ? (
                                <FavoriteNotification
                                    tweet={tweet}
                                    afterPostTweet={() => getAndSetTweets()}
                                    updateFavoriteState={() => updateFavoriteState(tweet)}
                                />
                            ) : (
                                <TweetTree
                                    tweet={tweet}
                                    afterPostTweet={() => getAndSetTweets()}
                                    updateFavoriteState={() => updateFavoriteState(tweet)}
                                />
                            )}
                        </ListItem>
                    ))}
                </List>
            </TabPanel>
            <TabPanel value={value} index={1}>
                {notificationsList.map((tweet: TweetType, index) => (
                    <ListItem key={index} alignItems="flex-start">
                        {'favoriteNotification' in tweet ? null : (
                            <TweetTree
                                tweet={tweet}
                                afterPostTweet={() => getAndSetTweets()}
                                updateFavoriteState={() => updateFavoriteState(tweet)}
                            />
                        )}
                    </ListItem>
                ))}
            </TabPanel>
        </>
    );
};

export default Notifications;
