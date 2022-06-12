import React, { useEffect, useState } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useCallApi } from '../utils/api.js';
import { useNavigate } from 'react-router-dom';

export function SettingsProfile() {
    const [username, setUsername] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessageForUsername, setErrorMessageForUsername] = useState('');
    const [errorMessageForEmail, setErrorMessageForEmail] = useState('');
    const callApi = useCallApi();
    const navigate = useNavigate();

    useEffect(() => {
        getProfile();
    }, []);

    function getProfile() {
        callApi('http://localhost:5000/api/zetter/profile')?.then((data) => {
            setUsername(data.username);
            setIntroduction(data.introduction);
            setEmail(data.email);
        });
    }

    function updateProfile() {
        callApi('http://localhost:5000/api/zetter/profile', {
            method: 'PATCH',
            body: JSON.stringify({ username: username, introduction: introduction, email: email }),
        });
        navigate('/profile');
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
                onChange={(e) => {
                    setUsername(e.target.value);
                    e.target.value.length === 0
                        ? setErrorMessageForUsername('名前を入力してください')
                        : setErrorMessageForUsername('');
                }}
                error={errorMessageForUsername ? true : false}
                helperText={errorMessageForUsername}
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
                onChange={(e) => {
                    setEmail(e.target.value);
                    e.target.value.length === 0
                        ? setErrorMessageForEmail('emailを入力してください')
                        : setErrorMessageForEmail('');
                }}
                error={errorMessageForEmail ? true : false}
                helperText={errorMessageForEmail}
            />
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
