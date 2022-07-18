import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TweetType } from './utils/types';
import useCallApi from './utils/api';
import ReplyButton from './ReplyButton';
import FavButton from './FavButton';
import dayjs from 'dayjs';
import './Home.css';

import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import IosShareIcon from '@mui/icons-material/IosShare';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

type SingleTweetProps = {
    tweet: TweetType;
    getAndSetTweets: () => void;
    updateFavoriteState: (tweet: TweetType) => void;
};

const SingleTweet: React.FC<SingleTweetProps> = (props) => {
    const callApi = useCallApi();
    const location = useLocation();

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
            {/* Linkになってる範囲が良くないので改良したい */}
            <Link to={'/tweet/' + props.tweet.id}>
                <ListItemAvatar>
                    <Avatar alt={props.tweet.user.username} src={props.tweet.user.icon} />
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <React.Fragment>
                            <Link to={'/tweet/' + props.tweet.id}>
                                {props.tweet.user.username + '・' + formatDate(props.tweet.createdAt)}
                            </Link>
                        </React.Fragment>
                    }
                    secondary={
                        <React.Fragment>
                            <Link to={'/tweet/' + props.tweet.id}>{props.tweet.content}</Link>
                            <br />
                            <ListItemIcon>
                                <ReplyButton tweet={props.tweet} getAndSetTweets={() => props.getAndSetTweets()} />
                                <Button variant="text">
                                    <CompareArrowsIcon />
                                </Button>
                                <FavButton
                                    numberOfFavorite={props.tweet.numberOfFavorite}
                                    isFavorite={props.tweet.isFavorite}
                                    onClick={() => props.updateFavoriteState(props.tweet)}
                                />
                                <Button variant="text">
                                    <IosShareIcon />
                                </Button>
                            </ListItemIcon>
                            <br />
                            {props.tweet.numberOfReply > 0 && location.pathname === '/' ? (
                                <Accordion>
                                    <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
                                        返信を表示する
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Link to={'/tweet/' + props.tweet.id}>
                                            <ListItemAvatar>
                                                <Avatar alt={props.tweet.user.username} src={props.tweet.user.icon} />
                                            </ListItemAvatar>
                                        </Link>
                                        <ListItemText
                                            primary={
                                                <React.Fragment>
                                                    <Link to={'/tweet/' + props.tweet.id}>
                                                        {props.tweet.user.username +
                                                            '・' +
                                                            formatDate(props.tweet.createdAt)}
                                                    </Link>
                                                </React.Fragment>
                                            }
                                            secondary={
                                                <React.Fragment>
                                                    <Link to={'/tweet/' + props.tweet.id}>{props.tweet.content}</Link>
                                                    <br />
                                                    <ListItemIcon>
                                                        <ReplyButton
                                                            tweet={props.tweet}
                                                            getAndSetTweets={() => props.getAndSetTweets()}
                                                        />
                                                        <Button variant="text">
                                                            <CompareArrowsIcon />
                                                        </Button>
                                                        <FavButton
                                                            numberOfFavorite={props.tweet.numberOfFavorite}
                                                            isFavorite={props.tweet.isFavorite}
                                                            onClick={() => props.updateFavoriteState(props.tweet)}
                                                        />
                                                        <Button variant="text">
                                                            <IosShareIcon />
                                                        </Button>
                                                    </ListItemIcon>
                                                    <Divider />
                                                </React.Fragment>
                                            }
                                        />
                                    </AccordionDetails>
                                </Accordion>
                            ) : null}
                            <Divider />
                        </React.Fragment>
                    }
                />
            </Link>
        </>
    );
};

export default SingleTweet;
