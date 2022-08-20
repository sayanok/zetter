import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { ProfileType } from './utils/types';
import useCallApi from './utils/api';

import Sidebar from './Sidebar';
import Login from './Login';
import Home from './Home';
import TweetDetail from './TweetDetail';
import Notifications from './Notifications';
import ProfilePage from './ProfilePage';
import Follow from './Follow';
import SettingsProfile from './SettingsProfile';

const Main: React.FC = () => {
  const callApi = useCallApi();
  const [myProfile, setMyProfile] = useState<ProfileType>();

  function getAndSetProfile() {
    getProfile()?.then(setMyProfile);
  }

  function getProfile(): Promise<ProfileType> | undefined {
    return callApi('http://localhost:5000/api/zetter/profile/login');
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {myProfile ? <Sidebar myProfile={myProfile} /> : <></>}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Routes>
          <Route path="login" element={<Login afterLogin={() => getAndSetProfile()} />} />
          <Route path="/" element={<Home />} />
          <Route path="tweet/:tweetId" element={<TweetDetail />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path=":username" element={<ProfilePage myProfile={myProfile} />} />
          <Route path=":username/followings" element={<Follow myProfile={myProfile} tabValue="followings" />} />
          <Route path=":username/followers" element={<Follow myProfile={myProfile} tabValue="followers" />} />
          <Route
            path="settings/:username"
            element={<SettingsProfile myProfile={myProfile} afterUpdateProfile={() => getAndSetProfile()} />}
          />
        </Routes>
      </Box>
    </Box>
  );
};

export default Main;
