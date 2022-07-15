import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TweetType } from './utils/types';
import useCallApi from './utils/api';
import dayjs from 'dayjs';
import FavButton from './FavButton';
import ReplyButton from './ReplyButton';

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

const Tweet: React.FC = () => {
    const callApi = useCallApi();
    const params = useParams();
    const [tweetsList, setTweets] = useState<Array<TweetType>>([]);
    const [tweet, setTweet] = useState<TweetType>();

    useEffect(() => {
        getTweet()?.then(setTweet);
        getReplys()?.then(setTweets);
    }, []);

    function getTweet(): Promise<TweetType> | undefined {
        return callApi('http://localhost:5000/api/zetter/' + params.tweetId);
    }

    function getReplys(): Promise<Array<TweetType>> | undefined {
        return callApi('http://localhost:5000/api/zetter/replys/' + params.tweetId);
    }

    function updateFavoriteState(tweet: TweetType): void {
        if (tweet.isFavorite) {
            // favから削除する
            callApi('http://localhost:5000/api/zetter', {
                method: 'PATCH',
                body: JSON.stringify({ tweet: tweet, order: 'delete' }),
            })?.then((data) => {
                setTweet(data);
            });
        } else {
            // favに追加する
            callApi('http://localhost:5000/api/zetter', {
                method: 'PATCH',
                body: JSON.stringify({ tweet: tweet, order: 'add' }),
            })?.then((data) => {
                setTweet(data);
            });
        }
    }

    function getAndSetTweets(): void {
        getReplys()?.then(setTweets);
    }

    function formatDate(createdAt: Date): string {
        const now: dayjs.Dayjs = dayjs();
        if (dayjs(createdAt).isBefore(now.subtract(1, 'd'))) {
            return dayjs(createdAt).format('M月DD日');
        } else {
            return String(now.diff(createdAt, 'hour')) + '時間前';
        }
    }

    return tweet ? (
        <>
            <ListItemAvatar>
                <Avatar alt={tweet.user.username} src={tweet.user.icon} />
            </ListItemAvatar>
            <ListItemText
                primary={tweet.user.username + '・' + formatDate(tweet.createdAt)}
                secondary={
                    <React.Fragment>
                        {tweet.content}
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
                        <Divider />
                    </React.Fragment>
                }
            />
            {tweet.numberOfReply > 0 ? (
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
                                        <Divider />
                                    </React.Fragment>
                                }
                            />
                            {/* </Link> */}
                        </ListItem>
                    ))}
                </List>
            ) : null}
        </>
    ) : null;
};

export default Tweet;
