import React, { useEffect, useState } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useCallApi } from './utils/api';
import { useNavigate } from 'react-router-dom';
import { ProfileType } from './utils/types';

type SettingsProfileType = {
    myProfile: ProfileType | undefined;
    afterUpdateProfile: () => void;
};

const SettingsProfile: React.FC<SettingsProfileType> = (props) => {
    const [username, setUsername] = useState<string>('');
    const [introduction, setIntroduction] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [errorMessageForUsername, setErrorMessageForUsername] = useState<string>('');
    const [errorMessageForEmail, setErrorMessageForEmail] = useState<string>('');
    const callApi = useCallApi();
    const navigate = useNavigate();

    useEffect(() => {
        if (props.myProfile) {
            setUsername(props.myProfile.username);
            setIntroduction(props.myProfile.introduction);
            setEmail(props.myProfile.email);
        }
    }, []);

    function updateProfile(): void {
        callApi('/profile', {
            method: 'PATCH',
            body: JSON.stringify({ username: username, introduction: introduction, email: email }),
        });
        props.afterUpdateProfile();
        navigate('/' + username);
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
