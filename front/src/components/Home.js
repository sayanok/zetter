import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { TweetForm } from './TweetForm.js';
import { useCallApi } from '../utils/api.js';

export function Home() {
    const [listTweets, setTweets] = useState([]);
    const callApi = useCallApi();

    useEffect(() => {
        getTweets();
    }, []);

    function getTweets() {
        callApi('http://localhost:5000/api/zetter')?.then((data) => {
            setTweets(data);
        });
    }

    return (
        <>
            <TweetForm getTweets={() => getTweets()} />
            <List>
                {listTweets.map((tweet) => (
                    <ListItem key={tweet.id}>
                        <p>
                            {tweet.username}
                            <br />
                            {tweet.content}
                            <br />
                            {tweet.time}
                        </p>
                    </ListItem>
                ))}
            </List>
        </>
    );
}
