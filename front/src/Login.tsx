import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { token } from './api';

type LoginType = {
    afterLogin: () => void;
};

const Login: React.FC<LoginType> = (props) => {
    const [username, setId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_BASE_URL;

    function login(): void {
        fetch(baseUrl + '/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password }),
        }).then((response) => {
            if (response.status === 200) {
                console.log('success');
                setErrorMessage('');
                response.json().then((response) => {
                    token.value = response;
                    props.afterLogin();
                    navigate('/');
                });
            } else if (response.status === 400) {
                console.log('fail');
                setErrorMessage('ログインに失敗しました');
            } else {
                console.log('something wrong');
                setErrorMessage('予期せぬエラーが発生しました');
            }
        });
    }

    return (
        <>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25%' },
                }}
                autoComplete="off"
            >
                <TextField
                    id="outlined-disabled"
                    placeholder="id"
                    value={username}
                    onChange={(e) => setId(e.target.value)}
                />
                <TextField
                    id="outlined-disabled"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Box>
            <div>{errorMessage}</div>
            <Button variant="contained" onClick={() => login()}>
                ログイン
            </Button>
        </>
    );
};

export default Login;
