import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TweetType } from './utils/types';
import { useCallApi, useCallUpdateFavoriteApi } from './utils/api';
import TweetTree from './TweetTree';
import SingleTweet from './SingleTweet';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

const TweetDetail: React.FC = () => {
    const callApi = useCallApi();
    const callUpdateFavoriteApi = useCallUpdateFavoriteApi();
    const params = useParams();
    const [tweet, setTweet] = useState<TweetType>();
    const [replyTweetsList, setReplyTweetsList] = useState<Array<TweetType>>([]);

    useEffect(() => {
        getTweet()?.then(setTweet);
        getReplys()?.then(setReplyTweetsList);
    }, [params.tweetId]);

    function getTweet(): Promise<TweetType> | undefined {
        return callApi('/tweet/' + params.tweetId);
    }

    function getReplys(): Promise<Array<TweetType>> | undefined {
        return callApi('/replys/' + params.tweetId);
    }

    function getAndSetTweets(): void {
        getTweet()?.then(setTweet);
        getReplys()?.then(setReplyTweetsList);
    }

    function updateFavoriteState(tweet: TweetType): void {
        callUpdateFavoriteApi(tweet)?.then((newTweet) => {
            setTweet(newTweet);
        });
    }

    function updateReplyFavoriteState(reply: TweetType): void {
        callUpdateFavoriteApi(reply)?.then((newReply) => {
            let newReplys = replyTweetsList.map((reply) => {
                if (newReply.id === reply.id) {
                    return newReply;
                } else {
                    return reply;
                }
            });
            setReplyTweetsList(newReplys);
        });
    }

    return tweet ? (
        <>
            <SingleTweet
                tweet={tweet}
                afterPostTweet={() => getAndSetTweets()}
                updateFavoriteState={() => updateFavoriteState(tweet)}
            />
            {replyTweetsList.length ? (
                <List sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}>
                    {replyTweetsList.map((replyTweet, index) => (
                        <ListItem key={replyTweet.id} alignItems="flex-start">
                            <TweetTree
                                tweet={replyTweet}
                                afterPostTweet={() => getAndSetTweets()}
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
