import React, { useEffect, useState } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import useCallApi from './utils/api';
import { useNavigate } from 'react-router-dom';

const SettingsProfile: React.FC = () => {
    const [username, setUsername] = useState<String>('');
    const [introduction, setIntroduction] = useState<String>('');
    const [email, setEmail] = useState<String>('');
    const [errorMessageForUsername, setErrorMessageForUsername] = useState<String>('');
    const [errorMessageForEmail, setErrorMessageForEmail] = useState<String>('');
    const callApi = useCallApi();
    const navigate = useNavigate();

    useEffect(() => {
        getProfile();
    }, []);

    function getProfile(): void {
        callApi('http://localhost:5000/api/zetter/profile')?.then(
            (data: { id: number; username: string; introduction: string; email: string; birthday: string }) => {
                setUsername(data.username);
                setIntroduction(data.introduction);
                setEmail(data.email);
            }
        );
    }

    function updateProfile(): void {
        callApi('http://localhost:5000/api/zetter/profile', {
            method: 'PATCH',
            body: JSON.stringify({ username: username, introduction: introduction, email: email }),
        });
        navigate('/profile');
    }

    function canSubmit(): boolean {
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
            <Button variant="contained" disabled={!canSubmit()} onClick={() => updateProfile()}>
                更新する
            </Button>
        </>
    );
};

export default SettingsProfile;
