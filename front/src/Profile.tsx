import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import useCallApi from './utils/api';

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<{
        id: number;
        username: string;
        icon: string;
        introduction: string;
        email: string;
        birthday: string;
    }>();

    const callApi = useCallApi();

    useEffect(() => {
        getProfile();
    }, []);

    function getProfile(): void {
        callApi('http://localhost:5000/api/zetter/profile')?.then(
            (data: {
                id: number;
                username: string;
                icon: string;
                introduction: string;
                email: string;
                birthday: string;
            }) => {
                setProfile(data);
            }
        );
    }
    return profile ? (
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
    ) : null;
};

export default Profile;
