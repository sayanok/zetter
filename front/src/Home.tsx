import React, { useEffect, useState } from 'react';
import useCallApi from './utils/api';
import TweetForm from './TweetForm';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

const Home: React.FC = () => {
    const callApi = useCallApi();
    const [listTweets, setTweets] = useState<Array<{ id: number; username: string; content: string; time: string }>>(
        []
    );

    useEffect(() => {
        getTweets();
    }, []);

    function getTweets(): void {
        callApi('http://localhost:5000/api/zetter', { headers: {} })?.then(
            (data: Array<{ id: number; username: string; content: string; time: string }>) => setTweets(data)
        );
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
};

export default Home;
