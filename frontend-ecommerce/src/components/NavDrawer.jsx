import React from 'react'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import { Toolbar } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';

function NavDrawer() {
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setOpen(false); // Close the drawer after navigation
    };

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <List>
                <ListItem disablePadding onClick={() => handleNavigation("/")}>
                    <ListItemButton>
                        <ListItemIcon>
                            <FormatListBulletedIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Products"} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding onClick={() => handleNavigation("/cart")}>
                    <ListItemButton>
                        <ListItemIcon>
                            <ShoppingCartIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Cart"} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <div>
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <MenuIcon onClick={toggleDrawer(true)}></MenuIcon>
                    <Drawer open={open} onClose={toggleDrawer(false)} keepMounted={false}>
                        {DrawerList}
                    </Drawer>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default NavDrawer