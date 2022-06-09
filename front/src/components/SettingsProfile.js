import React, { useEffect, useState } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { token } from '../api.js';

export function SettingsProfile() {
    const [username, setUsername] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        GetProfile();
    }, []);

    function GetProfile() {
        const authorization = token.value;

        if (authorization) {
            return fetch('http://localhost:5000/api/zetter/profile', {
                headers: { Authorization: authorization },
            })
                .then((response) => response.json())
                .then((data) => {
                    setUsername(data.username);
                    setIntroduction(data.introduction);
                    setEmail(data.email);
                });
        } else {
            console.log('ログインしてください');
            navigate('/login');
        }
    }

    function UpdateProfile() {
        const authorization = token.value;

        if (authorization) {
            fetch('http://localhost:5000/api/zetter/update/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: authorization },
                body: JSON.stringify({ username: username, introduction: introduction, email: email }),
            });
            navigate('/profile');
        } else {
            console.log('ログインしてください');
            navigate('/login');
        }
    }

    function CanSubmit() {
        if (username.length === 0 || email.length === 0) {
            return false;
        } else {
            return true;
        }
    }

    return (
        <>
            <TextField
                required
                id="outlined-basic"
                label="名前"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <TextField
                id="outlined-textarea"
                label="自己紹介"
                rows="4"
                multiline
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
            />
            <br />
            <TextField
                required
                id="outlined-basic"
                label="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            {errorMessage}
            <Button
                variant="contained"
                disabled={!CanSubmit()}
                onClick={() => UpdateProfile(username, introduction, email)}
            >
                更新する
            </Button>
        </>
    );
}
