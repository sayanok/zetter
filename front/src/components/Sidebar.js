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
                <Link href="/notifications">
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
    );
}
