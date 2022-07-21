import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import useCallApi from './utils/api';
import { TweetType } from './utils/types';
import TweetTree from './TweetTree';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

type TweetTreeProps = {
    tweetsList: Array<TweetType>;
    setTweets: Dispatch<SetStateAction<TweetType[]>>;
    getTweets: () => Promise<Array<TweetType>> | undefined;
};

const TweetTrees: React.FC<TweetTreeProps> = (props) => {
    const callApi = useCallApi();

    useEffect(() => {
        props.getTweets()?.then(props.setTweets);
    }, [props.tweetsList]);

    function updateFavoriteState(tweet: TweetType): void {
        if (tweet.isFavorite) {
            // favから削除する
            callApi('http://localhost:5000/api/zetter', {
                method: 'PATCH',
                body: JSON.stringify({ tweet: tweet, order: 'delete' }),
            })?.then((data) => {
                let result = props.tweetsList.map(function (value: TweetType): TweetType {
                    if (tweet.id === value.id) {
                        return data;
                    } else {
                        return value;
                    }
                });
                props.setTweets(result);
            });
        } else {
            // favに追加する
            callApi('http://localhost:5000/api/zetter', {
                method: 'PATCH',
                body: JSON.stringify({ tweet: tweet, order: 'add' }),
            })?.then((data) => {
                let result = props.tweetsList.map(function (value: TweetType): TweetType {
                    if (tweet.id === value.id) {
                        return data;
                    } else {
                        return value;
                    }
                });
                props.setTweets(result);
            });
        }
    }

    function getAndSetTweets(): void {
        props.getTweets()?.then(props.setTweets);
    }

    return (
        <>
            <List sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}>
                {props.tweetsList.map((tweet, index) => (
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
