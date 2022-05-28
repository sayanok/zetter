import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { token } from '../api.js';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';

export function Profile() {
    const [profile, setProfile] = useState([]);
    useEffect(() => {
        GetProfile();
    }, []);

    function GetProfile() {
        const authorization = token.value;

        return fetch('http://localhost:5000/api/zetter/profile', {
            headers: { Authorization: authorization },
        })
            .then((response) => response.json())
            .then((data) => setProfile(data));
    }

    return (
        <>
            <Button variant="contained">
                <Link to="/settings/profile">編集する</Link>
            </Button>
            <List>
                <ListItem key={profile.id}>
                    <p>
                        {profile.userName}
                        <br />
                        {profile.introduction}
                        <br />
                        誕生日: {profile.birthday}
                    </p>
                </ListItem>
            </List>
        </>
    );
}
