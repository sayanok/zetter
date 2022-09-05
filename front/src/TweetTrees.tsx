import React, { useEffect, Dispatch, SetStateAction } from 'react';
import { useCallUpdateFavoriteApi } from './utils/api';
import { TweetType } from './utils/types';
import TweetTree from './TweetTree';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

type TweetTreeProps = {
    tweetsList: Array<TweetType>;
    setTweets: Dispatch<SetStateAction<TweetType[]>>;
    afterPostTweet: () => void;
};

const TweetTrees: React.FC<TweetTreeProps> = (props) => {
    const callUpdateFavoriteApi = useCallUpdateFavoriteApi();

    useEffect(() => {}, [props.tweetsList]);

    function updateFavoriteState(tweet: TweetType): void {
        callUpdateFavoriteApi(tweet)?.then((newTweet) => {
            let newTweets = props.tweetsList.map((tweet) => {
                if (newTweet.id === tweet.id) {
                    return newTweet;
                } else {
                    return tweet;
                }
            });
            props.setTweets(newTweets);
        });
    }

    return (
        <>
            <List sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}>
                {props.tweetsList.map((tweet: TweetType, index) => (
                    <ListItem key={tweet.id} alignItems="flex-start">
                        <TweetTree
                            tweet={tweet}
                            afterPostTweet={() => props.afterPostTweet()}
                            updateFavoriteState={() => updateFavoriteState(tweet)}
                        />
                    </ListItem>
                ))}
            </List>
        </>
    );
};
export default TweetTrees;
