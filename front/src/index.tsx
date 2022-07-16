import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import Sidebar from './Sidebar';
import Login from './Login';
import Home from './Home';
import Tweet from './TweetDetail';
import Profile from './Profile';
import SettingsProfile from './SettingsProfile';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <Box sx={{ display: 'flex' }}>
            <BrowserRouter>
                <CssBaseline />
                <Sidebar />
                {/* /loginでは表示しない */}
                <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
                    <Routes>
                        <Route path="login" element={<Login />} />
                        <Route path="/" element={<Home />} />
                        <Route path="tweet/:tweetId" element={<Tweet />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="settings/:username" element={<SettingsProfile />} />
                    </Routes>
                </Box>
            </BrowserRouter>
        </Box>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
