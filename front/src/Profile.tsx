import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useCallApi from './utils/api';
import { ProfileType } from './utils/types';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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
            <Card sx={{ maxWidth: 500 }}>
                <CardMedia component="img" height="200" image={profile.header} alt={profile.username} />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {profile.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {profile.introduction}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        誕生日：{profile.birthday}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">
                        <Link to={'/settings/' + profile.username}>編集する</Link>
                    </Button>
                </CardActions>
            </Card>
        </>
    ) : null;
};

export default Profile;
