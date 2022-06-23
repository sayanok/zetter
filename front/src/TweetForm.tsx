import React, { useState } from 'react';
import useCallApi from './utils/api';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

type TweetFormProps = {
    getTweets: () => void;
};

const TweetForm: React.FC<TweetFormProps> = (props) => {
    const callApi = useCallApi();
    const [content, setContent] = useState<string>('');

    function PostTweet(): void {
        callApi('http://localhost:5000/api/zetter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: content }),
        });
        props.getTweets();
        CleanForm();
    }

    function CleanForm(): void {
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
                    placeholder="今然ぴどうしてる？"
                    multiline
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </Box>
            <Button variant="contained" onClick={(e) => PostTweet()}>
                ツイートする
            </Button>
        </>
    );
};

export default TweetForm;
