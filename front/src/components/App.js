import { BrowserRouter, Router, Route, Routes } from 'react-router-dom';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import { Home } from './Home.js';
import { Search } from './Search.js';
import { Notifications } from './Notifications.js';
import { Profile } from './Profile.js';
import { Settings } from './Settings.js';
import { SettingsProfile } from './SettingsProfile.js';
import { Sidebar } from './Sidebar.js';
import { Login } from './Login.js';

export function App() {
    return (
        <Box sx={{ display: 'flex' }}>
            <BrowserRouter>
                <CssBaseline />
                <Sidebar />
                {/* /loginでは表示しない */}
                <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
                    <Routes>
                        <Route path="login" element={<Login />} />
                        <Route path="/" element={<Home />} />
                        <Route path="search" element={<Search />} />
                        <Route path="notifications" element={<Notifications />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="settings/:userName" element={<SettingsProfile />} />
                    </Routes>
                </Box>
            </BrowserRouter>
        </Box>
    );
}
