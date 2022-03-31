import Button from '@mui/material/Button';

import react, { useState } from 'react';
import { BrowserRouter, Router, Route, Routes } from 'react-router-dom';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import TagIcon from '@mui/icons-material/Tag';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PetsIcon from '@mui/icons-material/Pets';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';

import { Home } from './Home.js';
import { Search } from './Search.js';
import { Notification } from './Notification.js';
import { Profile } from './Profile.js';
import { Settings } from './Settings.js';

const drawerWidth = 240;

export function App() {
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        aaa
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar>
                    {/* twitterに踏襲してるけどここ不要では */}
                    <Button>
                        <PetsIcon />
                    </Button>
                </Toolbar>
                <List>
                    {/* TODO: もっとシンプルにかけそう map使う */}
                    <Link href="/">
                        <ListItem button>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="home" />
                        </ListItem>
                    </Link>
                    <Link href="/search">
                        <ListItem button>
                            <ListItemIcon>
                                <TagIcon />
                            </ListItemIcon>
                            <ListItemText primary="search" />
                        </ListItem>
                    </Link>
                    <Link href="/notification">
                        {/* notifications? */}
                        <ListItem button>
                            <ListItemIcon>
                                <NotificationsIcon />
                            </ListItemIcon>
                            <ListItemText primary="通知" />
                        </ListItem>
                    </Link>
                    <Link href="/userid">
                        <ListItem button>
                            <ListItemIcon>
                                <AccountCircleIcon />
                            </ListItemIcon>
                            <ListItemText primary="プロフィール" />
                        </ListItem>
                    </Link>
                    <Link href="/settings">
                        <ListItem button>
                            <ListItemIcon>
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary="設定" />
                        </ListItem>
                    </Link>
                </List>
                <Button variant="contained">ツイートする</Button>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
                <Toolbar />
                {/* <Typography paragraph><Home />aaa</Typography> */}
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/notification" element={<Notification />} />
                        <Route path="/userid" element={<Profile />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </BrowserRouter>
            </Box>
        </Box>
    );
}
