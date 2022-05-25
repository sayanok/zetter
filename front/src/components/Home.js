import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { TweetForm } from './TweetForm.js';
import { token } from '../api.js';

export function Home() {
    const [listTweets, setTweets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        GetTweets();
    }, []);

    function GetTweets() {
        // const authorization = token.value;
        // if (authorization) {
        return fetch('http://localhost:5000/api/zetter', {
            // headers: { Authorization: authorization },
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => setTweets(data));
        // } else {
        //     console.log('ログインしてください');
        //     navigate('/login');
        // }
    }

    return (
        <>
            <TweetForm getTweets={() => GetTweets()} />
            <List>
                {listTweets.map((tweet) => (
                    <ListItem key={tweet.id}>
                        <p>
                            {tweet.userName}
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
