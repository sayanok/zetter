import React, { useEffect, useState } from 'react';
import { token } from '../api.js';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

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
        <List>
            <ListItem key={profile.id}>
                <p>
                    {profile.userName}
                    <br />
                    {profile.email}
                    <br />
                    {profile.introduction}
                </p>
            </ListItem>
        </List>
    );
}
