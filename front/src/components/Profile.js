import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { token } from '../api.js';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';

export function Profile() {
    const [profile, setProfile] = useState([]);
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
                .then((data) => setProfile(data));
        } else {
            console.log('ログインしてください');
            navigate('/login');
        }
    }

    return (
        <>
            <Button variant="contained">
                <Link to={'/settings/' + profile.username}>編集する</Link>
            </Button>
            <List>
                <ListItem key={profile.id}>
                    <p>
                        {profile.username}
                        <br />
                        {profile.introduction}
                        <br />
                        {profile.email}
                        <br />
                        誕生日: {profile.birthday}
                    </p>
                </ListItem>
            </List>
        </>
    );
}
