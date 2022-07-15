import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TweetForm from './TweetForm';
import useCallApi from './utils/api';
import dayjs from 'dayjs';
import { TweetType } from './utils/types';
import ReplyButton from './ReplyButton';
import FavButton from './FavButton';
import './Home.css';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import IosShareIcon from '@mui/icons-material/IosShare';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Home: React.FC = () => {
    const [tweetsList, setTweets] = useState<Array<TweetType>>([]);
    const callApi = useCallApi();

    useEffect(() => {
        getTweets()?.then(setTweets);
    }, []);

    function updateFavoriteState(tweet: TweetType): void {
        if (tweet.isFavorite) {
            // favから削除する
            callApi('http://localhost:5000/api/zetter', {
                method: 'PATCH',
                body: JSON.stringify({ tweet: tweet, order: 'delete' }),
            })?.then((data) => {
                let result = tweetsList.map(function (value: TweetType): TweetType {
                    if (tweet.id === value.id) {
                        return data;
                    } else {
                        return value;
                    }
                });
                setTweets(result);
            });
        } else {
            // favに追加する
            callApi('http://localhost:5000/api/zetter', {
                method: 'PATCH',
                body: JSON.stringify({ tweet: tweet, order: 'add' }),
            })?.then((data) => {
                let result = tweetsList.map(function (value: TweetType): TweetType {
                    if (tweet.id === value.id) {
                        return data;
                    } else {
                        return value;
                    }
                });
                setTweets(result);
            });
        }
    }

    function getTweets(): Promise<Array<TweetType>> | undefined {
        return callApi('http://localhost:5000/api/zetter');
    }

    function getAndSetTweets(): void {
        getTweets()?.then(setTweets);
    }

    function formatDate(createdAt: Date): string {
        const now: dayjs.Dayjs = dayjs();
        if (dayjs(createdAt).isBefore(now.subtract(1, 'd'))) {
            return dayjs(createdAt).format('M月DD日');
        } else {
            return String(now.diff(createdAt, 'hour')) + '時間前';
        }
    }

    return (
        <>
            <TweetForm getAndSetTweets={() => getAndSetTweets()} caller={'Home'} replyTo={null} />
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Button variant="text">最新のツイートを表示する</Button>
                </Typography>
            </Toolbar>
            {/* 今の実装だと、最新の10件しか表示されてない
            今まで表示してる10件＋最新のn件のツイートを取得する方法を検討する必要がある */}
            {/* 表示していない最新のツイートがあるときのみ表示する */}
            <List sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}>
                {tweetsList.map((tweet, index) => (
                    <ListItem key={tweet.id} alignItems="flex-start">
                        {/* Linkになってる範囲が良くないので改良したい */}
                        <Link to={'/tweet/' + tweet.id}>
                            <ListItemAvatar>
                                <Avatar alt={tweet.user.username} src={tweet.user.icon} />
                            </ListItemAvatar>
                        </Link>
                        <ListItemText
                            primary={
                                <React.Fragment>
                                    <Link to={'/tweet/' + tweet.id}>
                                        {tweet.user.username + '・' + formatDate(tweet.createdAt)}
                                    </Link>
                                </React.Fragment>
                            }
                            secondary={
                                <React.Fragment>
                                    <Link to={'/tweet/' + tweet.id}>{tweet.content}</Link>
                                    <br />
                                    <ListItemIcon>
                                        <ReplyButton tweet={tweet} getAndSetTweets={() => getAndSetTweets()} />
                                        <Button variant="text">
                                            <CompareArrowsIcon />
                                        </Button>
                                        <FavButton
                                            numberOfFavorite={tweet.numberOfFavorite}
                                            isFavorite={tweet.isFavorite}
                                            onClick={() => updateFavoriteState(tweet)}
                                        />
                                        <Button variant="text">
                                            <IosShareIcon />
                                        </Button>
                                    </ListItemIcon>
                                    <br />
                                    {tweet.numberOfReply > 0 ? (
                                        <Button variant="text" onClick={() => getTweets()}>
                                            返信を表示する
                                        </Button>
                                    ) : null}
                                    <Divider />
                                </React.Fragment>
                            }
                        />
                        {/* </Link> */}
                    </ListItem>
                ))}
            </List>
        </>
    );
};

export default Home;
