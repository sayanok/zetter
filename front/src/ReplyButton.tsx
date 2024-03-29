import React from 'react';
import { TweetType } from './utils/types';
import TweetForm from './TweetForm';

import Button from '@mui/material/Button';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

type ReplyButtonProps = {
    tweet: TweetType;
    afterPostTweet: () => void;
};

const ReplyButton: React.FC<ReplyButtonProps> = (props) => {
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

    return (
        <>
            <Button
                onClick={(e) => {
                    e.preventDefault();
                    handleOpen();
                }}
            >
                <ChatBubbleOutlineIcon />
            </Button>
            {props.tweet.replyFrom.length}
            <Modal
                open={open}
                onClose={(e: Event) => {
                    e.preventDefault();
                    handleClose();
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{ backgroundColor: '#ffffff00' }}
            >
                <Box sx={style}>
                    {props.tweet ? (
                        <>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                <Avatar alt={props.tweet.user.username} src={props.tweet.user.icon} />
                                {props.tweet.user.username}
                                <br />
                                {props.tweet.content}
                            </Typography>
                            <TweetForm afterPostTweet={() => props.afterPostTweet()} replySourceTweet={props.tweet} />
                        </>
                    ) : (
                        'ツイートを取得できませんでした'
                    )}
                </Box>
            </Modal>
        </>
    );
};

export default ReplyButton;
