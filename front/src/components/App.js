import { BrowserRouter, Router, Route, Routes } from 'react-router-dom';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import { Home } from './Home.js';
import { Search } from './Search.js';
import { Notifications } from './Notifications.js';
import { Profile } from './Profile.js';
import { Settings } from './Settings.js';
import { Sidebar } from './Sidebar.js';

export function App() {
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/userid" element={<Profile />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </BrowserRouter>
            </Box>
        </Box>
    );
}
