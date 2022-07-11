import React, { useEffect, useState } from 'react';
import TweetForm from './TweetForm';
import useCallApi from './utils/api';
import dayjs from 'dayjs';
import { TweetType } from './utils/types';
import FavButton from './FavButton';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import IosShareIcon from '@mui/icons-material/IosShare';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const Home: React.FC = () => {
    const [tweetsList, setTweets] = useState<Array<TweetType>>([]);
    const callApi = useCallApi();
    const [modalTweet, setModalTweet] = useState<TweetType>();

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    useEffect(() => {
        getTweets()?.then(setTweets);
    }, []);

    function updateFavoriteState(tweet: TweetType): void {
        if (tweet.isFavorite) {
            // favから削除する
            callApi('http://localhost:5000/api/zetter', {
                method: 'PATCH',
                body: JSON.stringify({ tweet: tweet, order: 'delete' }),
            })?.then((data) => {
                let result = tweetsList.map(function (value: TweetType): TweetType {
                    if (tweet.id === value.id) {
                        return data;
                    } else {
                        return value;
                    }
                });
                setTweets(result);
            });
        } else {
            // favに追加する
            callApi('http://localhost:5000/api/zetter', {
                method: 'PATCH',
                body: JSON.stringify({ tweet: tweet, order: 'add' }),
            })?.then((data) => {
                let result = tweetsList.map(function (value: TweetType): TweetType {
                    if (tweet.id === value.id) {
                        return data;
                    } else {
                        return value;
                    }
                });
                setTweets(result);
            });
        }
    }

    function getTweets(): Promise<Array<TweetType>> | undefined {
        return callApi('http://localhost:5000/api/zetter');
    }

    function getAndSetTweets(): void {
        getTweets()?.then(setTweets);
    }

    function setModalTweetAndHandleOpen(tweet: TweetType): void {
        setModalTweet(tweet);
        handleOpen();
    }

    function formatDate(createdAt: Date): string {
        const now: dayjs.Dayjs = dayjs();
        if (dayjs(createdAt).isBefore(now.subtract(1, 'd'))) {
            return dayjs(createdAt).format('M月DD日');
        } else {
            return String(now.diff(createdAt, 'hour')) + '時間前';
        }
    }

    return (
        <>
            <TweetForm getAndSetTweets={() => getAndSetTweets()} caller={'Home'} replyTo={null} />
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Button variant="text">最新のツイートを表示する</Button>
                </Typography>
            </Toolbar>
            {/* 今の実装だと、最新の10件しか表示されてない
            今まで表示してる10件＋最新のn件のツイートを取得する方法を検討する必要がある */}
            {/* 表示していない最新のツイートがあるときのみ表示する */}
            <List sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}>
                {tweetsList.map((tweet, index) => (
                    <ListItem key={tweet.id} alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar alt={tweet.user.username} src={tweet.user.icon} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={tweet.user.username + '・' + formatDate(tweet.createdAt)}
                            secondary={
                                <React.Fragment>
                                    {tweet.content}
                                    <br />
                                    <ListItemIcon>
                                        <Button onClick={() => setModalTweetAndHandleOpen(tweet)}>
                                            <ChatBubbleOutlineIcon />
                                        </Button>
                                        <Modal
                                            open={open}
                                            onClose={handleClose}
                                            aria-labelledby="modal-modal-title"
                                            aria-describedby="modal-modal-description"
                                            className="Modal"
                                        >
                                            <Box sx={style}>
                                                {modalTweet ? (
                                                    <>
                                                        <Typography id="modal-modal-title" variant="h6" component="h2">
                                                            <Avatar
                                                                alt={modalTweet.user.username}
                                                                src={modalTweet.user.icon}
                                                            />
                                                            {modalTweet.user.username}
                                                            <br />
                                                            {modalTweet.content}
                                                        </Typography>
                                                        <TweetForm
                                                            getAndSetTweets={() => getAndSetTweets()}
                                                            caller={'reply'}
                                                            replyTo={modalTweet.id}
                                                        />
                                                    </>
                                                ) : (
                                                    'ツイートを取得できませんでした'
                                                )}
                                            </Box>
                                        </Modal>
                                        {tweet.numberOfReply}
                                        <Button variant="text">
                                            <CompareArrowsIcon />
                                        </Button>
                                        <FavButton
                                            numberOfFavorite={tweet.numberOfFavorite}
                                            isFavorite={tweet.isFavorite}
                                            onClick={() => updateFavoriteState(tweet)}
                                        />
                                        <Button variant="text">
                                            <IosShareIcon />
                                        </Button>
                                    </ListItemIcon>
                                    <br />
                                    {tweet.numberOfReply > 0 ? (
                                        <Button variant="text" onClick={() => getTweets()}>
                                            返信を表示する
                                        </Button>
                                    ) : null}
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
