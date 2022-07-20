import React, { useState, useEffect } from 'react';
import useCallApi from './utils/api';
import { TweetType } from './utils/types';
import TweetTree from './TweetTree';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

const TweetTrees: React.FC = () => {
    const callApi = useCallApi();
    const [tweetsList, setTweets] = useState<Array<TweetType>>([]);

    useEffect(() => {
        getTweets()?.then(setTweets);
    }, [tweetsList]);

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

    return (
        <>
            <List sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}>
                {tweetsList.map((tweet, index) => (
                    <ListItem key={tweet.id} alignItems="flex-start">
                        <TweetTree
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
export default TweetTrees;
