import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TweetForm from './TweetForm';
import useCallApi from './utils/api';

const Home: React.FC = () => {
    const [listTweets, setTweets] = useState<Array<{ id: number; username: string; content: string; time: string }>>(
        []
    );
    const callApi = useCallApi();

    useEffect(() => {
        getTweets()?.then((data) => setTweets(data));
    }, []);

    function getTweets(): Promise<Array<{ id: number; username: string; content: string; time: string }>> | undefined {
        return callApi('http://localhost:5000/api/zetter');
    }

    return (
        <>
            <TweetForm getTweets={() => getTweets()} setTweets={() => setTweets(listTweets)} />
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
