import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export function TweetForm(props) {
    const [userName, setUserName] = useState('むー');
    // TODO ログインしているユーザーの名前を取得する
    const [content, setContent] = useState('');

    function PostTweet() {
        fetch('http://localhost:5000/api/zetter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName: userName, content: content }),
        });
        props.onClick();
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
                <TextField disabled id="outlined-disabled" defaultValue={userName} />
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
