import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import useCallApi from './utils/api';

type TweetFormProps = { getAndSetTweets: () => void; caller: string; replyTo: null | number };

const TweetForm: React.FC<TweetFormProps> = (props) => {
    const [content, setContent] = useState<string>('');
    const [replyTo, setReplyTo] = useState<null | number>();
    const [placeholder, setPlaceholder] = useState<string>('今然ぴどうしてる？');
    const callApi = useCallApi();

    useEffect(() => {
        if (props.caller === 'Home') {
            setPlaceholder('今然ぴどうしてる？');
        } else if (props.caller === 'reply') {
            setPlaceholder('返信をツイートする');
            props.replyTo ? setReplyTo(props.replyTo) : setReplyTo(null);
            // replyToがnullならエラー返したほうがよいかも
        }
    }, []);

    function postTweet(): void {
        callApi('http://localhost:5000/api/zetter', {
            method: 'POST',
            body: JSON.stringify({ content: content, replyTo: replyTo }),
        });
        props.getAndSetTweets();
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
                    onChange={(e) => setContent(e.target.value)}
                />
            </Box>
            <Button variant="contained" onClick={() => postTweet()}>
                ツイートする
            </Button>
        </>
    );
};

export default TweetForm;
