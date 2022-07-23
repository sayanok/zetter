import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { ProfileType } from './utils/types';
import useCallApi from './utils/api';

import Sidebar from './Sidebar';
import Login from './Login';
import Home from './Home';
import TweetDetail from './TweetDetail';
import ProfilePage from './ProfilePage';
import SettingsProfile from './SettingsProfile';

const Main: React.FC = () => {
    const callApi = useCallApi();
    const [profile, setProfile] = useState<ProfileType>();

    function getAndSetProfile() {
        getProfile()?.then(setProfile);
    }

    function getProfile(): Promise<ProfileType> | undefined {
        return callApi('http://localhost:5000/api/zetter/profile/login');
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            {profile ? <Sidebar profile={profile} /> : <></>}
            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
                <Routes>
                    <Route path="login" element={<Login afterLogin={() => getAndSetProfile()} />} />
                    <Route path="/" element={<Home />} />
                    <Route path="tweet/:tweetId" element={<TweetDetail />} />
                    <Route path=":username" element={<ProfilePage />} />
                    <Route path="settings/:username" element={<SettingsProfile />} />
                </Routes>
            </Box>
        </Box>
    );
};

export default Main;
