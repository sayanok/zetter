import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import useCallApi from './utils/api';

type TweetFormProps = { getTweets: () => void; setTweets: () => void };

const TweetForm: React.FC<TweetFormProps> = (props) => {
    const [content, setContent] = useState<string>('');
    const callApi = useCallApi();

    function postTweet(): void {
        callApi('http://localhost:5000/api/zetter', {
            method: 'POST',
            body: JSON.stringify({ content: content }),
        });
        props.getTweets();
        props.setTweets();
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
                    placeholder="今然ぴどうしてる？"
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
