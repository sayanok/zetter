import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useCallApi from './utils/api';
import { ProfileType } from './utils/types';

import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import TagIcon from '@mui/icons-material/Tag';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PetsIcon from '@mui/icons-material/Pets';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';

const Sidebar: React.FC = () => {
    const [profile, setProfile] = useState<ProfileType>();
    const callApi = useCallApi();
    const drawerWidth: number = 240;
    const listContents: Array<{ href: string; iconComponent: JSX.Element; text: string }> = [
        {
            href: '/',
            iconComponent: <HomeIcon />,
            text: 'home',
        },
        {
            href: 'search',
            iconComponent: <TagIcon />,
            text: 'search',
        },
        {
            href: 'notifications',
            iconComponent: <NotificationsIcon />,
            text: 'notifications',
        },
        {
            href: setUsername(),
            iconComponent: <AccountCircleIcon />,
            text: 'profile',
        },
        {
            href: 'settings',
            iconComponent: <SettingsIcon />,
            text: 'settings',
        },
    ];

    function setUsername() {
        getProfile()?.then(setProfile);
        if (profile) {
            return profile.username;
        } else {
            return '';
        }
    }

    function getProfile(): Promise<ProfileType> | undefined {
        return callApi('http://localhost:5000/api/zetter/profile');
    }

    return (
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
                {listContents.map((content) => (
                    <Link to={content.href} key={content.text}>
                        <ListItem button>
                            <ListItemIcon>{content.iconComponent}</ListItemIcon>
                            <ListItemText primary={content.text} />
                        </ListItem>
                    </Link>
                ))}
            </List>
            <Button variant="contained">ツイートする</Button>
        </Drawer>
    );
};

export default Sidebar;
