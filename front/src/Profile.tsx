import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import useCallApi from './utils/api';
import { ProfileType } from './utils/types';

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<ProfileType>();

    const callApi = useCallApi();

    useEffect(() => {
        getProfile()?.then(setProfile);
    }, []);

    function getProfile(): Promise<ProfileType> | undefined {
        return callApi('http://localhost:5000/api/zetter/profile');
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
