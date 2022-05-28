import React, { useEffect, useState } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { token } from '../api.js';

export function SettingsProfile() {
    const [userName, setUserName] = useState('');
    const [introduction, setIntroduction] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        GetProfile();
    }, []);

    function GetProfile() {
        const authorization = token.value;

        return fetch('http://localhost:5000/api/zetter/profile', {
            headers: { Authorization: authorization },
        })
            .then((response) => response.json())
            .then((data) => {
                setUserName(data.userName);
                setIntroduction(data.introduction);
            });
    }

    function UpdateProfile() {
        const authorization = token.value;

        fetch('http://localhost:5000/api/zetter/update/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: authorization },
            body: JSON.stringify({ userName: userName, introduction: introduction }),
        }).then((response) => {
            // TODO: このへんてきとうに書いてるのでなおす
            if (response.status === 200) {
                console.log('success');
                navigate('/profile');
            } else {
                console.log('something wrong');
            }
        });
    }

    return (
        <>
            <TextField
                id="outlined-basic"
                label="名前"
                variant="outlined"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
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
            <p>生年月日</p>
            <Button variant="contained" onClick={() => UpdateProfile(userName, introduction)}>
                更新する
            </Button>
        </>
    );
}
