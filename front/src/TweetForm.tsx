import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import useCallApi from './utils/api';
import { TweetType } from './utils/types';

type TweetFormProps = { afterPostTweet: () => void; replySourceTweet: null | TweetType };

const TweetForm: React.FC<TweetFormProps> = (props) => {
    const [content, setContent] = useState<string>(
        props.replySourceTweet ? '@' + props.replySourceTweet?.user.username : ''
    );
    const [replyTo, setReplyTo] = useState<null | number>();
    const [placeholder, setPlaceholder] = useState<string>('今然ぴどうしてる？');
    const callApi = useCallApi();

    useEffect(() => {
        if (props.replySourceTweet === null) {
            setPlaceholder('今然ぴどうしてる？');
        } else {
            setPlaceholder('返信をツイートする');
            props.replySourceTweet ? setReplyTo(props.replySourceTweet.id) : setReplyTo(null);
            // replySourceTweetがnullならエラー返したほうがよいかも
        }
    }, []);

    function postTweet(): void {
        callApi('http://localhost:5000/api/zetter', {
            method: 'POST',
            body: JSON.stringify({ content: content, replyTo: replyTo }),
        });
        props.afterPostTweet();
        CleanForm();
    }

    function CleanForm() {
        setContent('');
    }

    return (
        <>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '100%' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    id="outlined-multiline-static"
                    placeholder={placeholder}
                    multiline
                    rows={4}
                    value={content}
                    onClick={(e) => e.preventDefault()}
                    onChange={(e) => {
                        setContent(e.target.value);
                    }}
                />
            </Box>
            <Button
                variant="contained"
                onClick={(e) => {
                    e.preventDefault();
                    postTweet();
                }}
            >
                ツイートする
            </Button>
        </>
    );
};

export default TweetForm;
