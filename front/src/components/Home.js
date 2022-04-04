import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

export function Home() {
    const [listTweets, setTweets] = useState([]);

    useEffect(() => {
        GetTweets();
    }, []);

    function GetTweets() {
        return fetch('http://localhost:5000/api/zetter')
            .then((response) => response.json())
            .then((data) => setTweets(data));
    }

    return (
        <>
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
