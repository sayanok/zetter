import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Link from '@mui/material/Link';
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

const drawerWidth = 240;
const listContents = [
    {
        href: '/',
        iconComponent: <HomeIcon />,
        text: 'home',
    },
    {
        href: '/search',
        iconComponent: <TagIcon />,
        text: 'search',
    },
    {
        href: '/notifications',
        iconComponent: <NotificationsIcon />,
        text: 'notifications',
    },
    {
        href: '/userid',
        iconComponent: <AccountCircleIcon />,
        text: 'profile',
    },
    {
        href: '/settings',
        iconComponent: <SettingsIcon />,
        text: 'settings',
    },
];

export function Sidebar() {
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
                    <Link href={content.href}>
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
}
