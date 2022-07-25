import React, { useState, useEffect } from 'react';
import TweetForm from './TweetForm';
import useCallApi from './utils/api';
import { TweetType } from './utils/types';
import TweetTrees from './TweetTrees';

import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Home: React.FC = () => {
    const [tweetsList, setTweets] = useState<Array<TweetType>>([]);
    const callApi = useCallApi();

    useEffect(() => {
        getTweets()?.then(setTweets);
    }, []);

    function getTweets(): Promise<Array<TweetType>> | undefined {
        return callApi('http://localhost:5000/api/zetter');
    }

    function getAndSetTweets(): void {
        getTweets()?.then(setTweets);
    }

    return (
        <>
            <TweetForm getAndSetTweets={() => getAndSetTweets()} replySourceTweet={null} />
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Button variant="text">最新のツイートを表示する</Button>
                </Typography>
            </Toolbar>
            {/* 今の実装だと、最新の10件しか表示されてない
            今まで表示してる10件＋最新のn件のツイートを取得する方法を検討する必要がある */}
            {/* 表示していない最新のツイートがあるときのみ表示する */}
            <TweetTrees tweetsList={tweetsList} setTweets={setTweets} getTweets={getTweets} />
        </>
    );
};

export default Home;
