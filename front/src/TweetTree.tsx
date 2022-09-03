import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCallApi, useCallUpdateFavoriteApi } from './utils/api';
import { TweetType } from './utils/types';
import SingleTweet from './SingleTweet';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

type TweetTreeProps = {
    tweet: TweetType;
    afterPostTweet: () => void;
    updateFavoriteState: (tweet: TweetType) => void;
};

const TweetTree: React.FC<TweetTreeProps> = (props) => {
    const location = useLocation();
    const callApi = useCallApi();
    const callUpdateFavoriteApi = useCallUpdateFavoriteApi();
    const [replyTweetsList, setReplyTweetsList] = useState<Array<TweetType>>([]);

    function getReplys(): Promise<Array<TweetType>> | undefined {
        return callApi('http://localhost:5000/api/zetter/replys/' + props.tweet.id);
    }

    function getAndSetReplys(): void {
        getReplys()?.then(setReplyTweetsList);
    }

    function updateReplyFavoriteState(reply: TweetType): void {
        callUpdateFavoriteApi(reply)?.then((data) => {
            let result = replyTweetsList.map(function (value: TweetType): TweetType {
                if (reply.id === value.id) {
                    return data;
                } else {
                    return value;
                }
            });
            setReplyTweetsList(result);
        });
    }

    return (
        <>
            <div>
                <SingleTweet
                    tweet={props.tweet}
                    afterPostTweet={() => props.afterPostTweet()}
                    updateFavoriteState={() => props.updateFavoriteState(props.tweet)}
                />
                <br />
                {props.tweet.numberOfReply > 0 && location.pathname === '/' ? (
                    <Accordion>
                        <AccordionSummary aria-controls="panel1a-content" id="panel1a-header" onClick={getAndSetReplys}>
                            返信を表示する
                        </AccordionSummary>
                        <AccordionDetails>
                            <List sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}>
                                {replyTweetsList.map((replyTweet, index) => (
                                    <ListItem key={replyTweet.id} alignItems="flex-start">
                                        <SingleTweet
                                            tweet={replyTweet}
                                            afterPostTweet={() => props.afterPostTweet()}
                                            updateFavoriteState={() => updateReplyFavoriteState(replyTweet)}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                ) : null}
            </div>
        </>
    );
};

export default TweetTree;
