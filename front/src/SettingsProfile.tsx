import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCallApi from './utils/api';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const SettingsProfile: React.FC = () => {
    const callApi = useCallApi();
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>('');
    const [introduction, setIntroduction] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [errorMessageForUsername, setErrorMessageForUsername] = useState<string>('');
    const [errorMessageForEmail, setErrorMessageForEmail] = useState<string>('');

    useEffect(() => {
        getProfile();
    }, []);

    function getProfile(): void {
        callApi('http://localhost:5000/api/zetter/profile', { headers: {} })?.then(
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, introduction, email: email }),
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
