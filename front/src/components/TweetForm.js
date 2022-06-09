import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { token } from '../api.js';

export function TweetForm(props) {
    // TODO ログインしているユーザーの名前を取得する
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    function PostTweet() {
        const authorization = token.value;

        if (authorization) {
            fetch('http://localhost:5000/api/zetter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: authorization },
                body: JSON.stringify({ content: content }),
            });
            props.getTweets();
            CleanForm();
        } else {
            console.log('ログインしてください');
            navigate('/login');
        }
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
            <Button variant="contained" onClick={() => PostTweet(content)}>
                ツイートする
            </Button>
        </>
    );
}
