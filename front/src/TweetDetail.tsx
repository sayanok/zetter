import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TweetType } from './utils/types';
import useCallApi from './utils/api';
import SingleTweet from './SingleTweet';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

const TweetDetail: React.FC = () => {
    const callApi = useCallApi();
    const params = useParams();
    const [tweet, setTweet] = useState<TweetType>();
    const [tweetsList, setTweets] = useState<Array<TweetType>>([]);

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

    function getAndSetTweets(): void {
        getTweet()?.then(setTweet);
        getReplys()?.then(setTweets);
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

    function updateReplyFavoriteState(reply: TweetType): void {
        if (reply.isFavorite) {
            callApi('http://localhost:5000/api/zetter', {
                method: 'PATCH',
                body: JSON.stringify({ tweet: reply, order: 'delete' }),
            })?.then((data) => {
                let result = tweetsList.map(function (value: TweetType): TweetType {
                    if (reply.id === value.id) {
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
                body: JSON.stringify({ tweet: reply, order: 'add' }),
            })?.then((data) => {
                let result = tweetsList.map(function (value: TweetType): TweetType {
                    if (reply.id === value.id) {
                        return data;
                    } else {
                        return value;
                    }
                });
                setTweets(result);
            });
        }
    }

    return tweet ? (
        <>
            <SingleTweet
                tweet={tweet}
                getAndSetTweets={() => getAndSetTweets()}
                updateFavoriteState={() => updateFavoriteState(tweet)}
            />
            {tweetsList.length ? (
                <List sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}>
                    {tweetsList.map((replyTweet, index) => (
                        <ListItem key={replyTweet.id} alignItems="flex-start">
                            <SingleTweet
                                tweet={replyTweet}
                                getAndSetTweets={() => getAndSetTweets()}
                                updateFavoriteState={() => updateReplyFavoriteState(replyTweet)}
                            />
                        </ListItem>
                    ))}
                </List>
            ) : null}
        </>
    ) : null;
};

export default TweetDetail;
