import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useCallApi from './utils/api';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';

const Profile: React.FC = () => {
    const callApi = useCallApi();
    const [profile, setProfile] = useState<{
        id: number;
        username: string;
        introduction: string;
        email: string;
        birthday: string;
    }>();

    useEffect(() => {
        getProfile();
    }, []);

    function getProfile(): void {
        callApi('http://localhost:5000/api/zetter/profile', { headers: {} })?.then(
            (data: { id: number; username: string; introduction: string; email: string; birthday: string }) => {
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
