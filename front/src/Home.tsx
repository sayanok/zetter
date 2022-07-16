import React, { useEffect, useState } from 'react';
import TweetForm from './TweetForm';
import useCallApi from './utils/api';
import { TweetType } from './utils/types';
import SingleTweet from './SingleTweet';
import './Home.css';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Home: React.FC = () => {
    const [tweetsList, setTweets] = useState<Array<TweetType>>([]);
    const callApi = useCallApi();

    useEffect(() => {
        // SingleTweetComponentにうつす？
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
        // SingleTweetComponentにうつす？
        return callApi('http://localhost:5000/api/zetter');
    }

    function getAndSetTweets(): void {
        getTweets()?.then(setTweets);
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
                        <SingleTweet
                            tweet={tweet}
                            getAndSetTweets={() => getAndSetTweets()}
                            updateFavoriteState={() => updateFavoriteState(tweet)}
                        />
                    </ListItem>
                ))}
            </List>
        </>
    );
};

export default Home;
