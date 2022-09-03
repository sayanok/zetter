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
        callUpdateFavoriteApi(tweet)?.then((data) => {
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
