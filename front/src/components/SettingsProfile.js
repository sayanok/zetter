import React, { useEffect, useState } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { token } from '../api.js';

export function SettingsProfile() {
    const [username, setUsername] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessageForUsername, setErrorMessageForUsername] = useState('');
    const [errorMessageForEmail, setErrorMessageForEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getProfile();
    }, []);

    function getProfile() {
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

    function updateProfile() {
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

    function canSubmit() {
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
                onBlur={
                    username.length === 0
                        ? () => setErrorMessageForUsername('名前を入力してください')
                        : () => setErrorMessageForUsername('')
                }
            />
            <br />
            {errorMessageForUsername}
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
                onBlur={
                    email.length === 0
                        ? () => setErrorMessageForEmail('emailを入力してください')
                        : () => setErrorMessageForEmail('')
                }
            />
            <br />
            {errorMessageForEmail}
            <br />
            <Button
                variant="contained"
                disabled={!canSubmit()}
                onClick={() => updateProfile(username, introduction, email)}
            >
                更新する
            </Button>
        </>
    );
}
