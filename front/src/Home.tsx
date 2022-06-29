import React, { useEffect, useState } from 'react';
import TweetForm from './TweetForm';
import useCallApi from './utils/api';
import dayjs from 'dayjs';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import IosShareIcon from '@mui/icons-material/IosShare';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Home: React.FC = () => {
    const [listTweets, setTweets] = useState<Array<{ id: number; username: string; content: string; date: Date }>>([]);
    const callApi = useCallApi();

    useEffect(() => {
        getTweets()?.then((data) => setTweets(data));
    }, []);

    function getTweets(): Promise<Array<{ id: number; username: string; content: string; date: Date }>> | undefined {
        return callApi('http://localhost:5000/api/zetter');
    }

    function formatDate(date: Date): string {
        const now: dayjs.Dayjs = dayjs();
        if (dayjs(date).isBefore(now.subtract(1, 'd'))) {
            return dayjs(date).format('M月DD日');
        } else {
            return String(now.diff(date, 'hour')) + '時間前';
        }
    }

    return (
        <>
            <TweetForm getTweets={() => getTweets()} setTweets={() => setTweets(listTweets)} />
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Button variant="text">最新のツイートを表示する</Button>
                </Typography>
            </Toolbar>
            {/* 今の実装だと、最新の10件しか表示されてない
            今まで表示してる10件＋最新のn件のツイートを取得する方法を検討する必要がある */}
            {/* 表示していない最新のツイートがあるときのみ表示する */}
            <List sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}>
                {listTweets.map((tweet) => (
                    <ListItem key={tweet.id} alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar alt={tweet.username} src="/static/images/avatar/1.jpg" />
                        </ListItemAvatar>

                        <ListItemText
                            primary={tweet.username + '・' + formatDate(tweet.date)}
                            secondary={
                                <React.Fragment>
                                    {tweet.content}
                                    <br />
                                    <ListItemIcon>
                                        <Button variant="text">
                                            <ChatBubbleOutlineIcon />
                                        </Button>
                                        <Button variant="text">
                                            <CompareArrowsIcon />
                                        </Button>
                                        <Button variant="text">
                                            <StarBorderIcon />
                                        </Button>
                                        <Button variant="text">
                                            <IosShareIcon />
                                        </Button>
                                    </ListItemIcon>
                                    <Divider />
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </>
    );
};

export default Home;
