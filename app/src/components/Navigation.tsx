import React, { useState } from 'react';
import { Box, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage';
import CodeIcon from '@mui/icons-material/Code';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    background: 'rgba(10, 10, 31, 0.9)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(0,255,255,0.1)',
}));

const NavItem = styled(ListItem)<{ active?: boolean }>(({ active, theme }) => ({
    color: active ? '#00ffff' : '#fff',
    cursor: 'pointer',
    '&:hover': {
        background: 'rgba(0,255,255,0.1)',
    },
    '& .MuiListItemIcon-root': {
        color: active ? '#00ffff' : '#fff',
    }
}));

const NavMenuItem = styled(motion.div)(({ theme }) => ({
    width: '100%',
}));

const menuVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
        }
    }),
};

const Navigation: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const router = useRouter();

    const navItems = [
        { title: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { title: 'NFT Marketplace', icon: <ShoppingCartIcon />, path: '/marketplace' },
        { title: 'Smart Contracts', icon: <CodeIcon />, path: '/contracts' },
        { title: 'Storage', icon: <StorageIcon />, path: '/storage' },
    ];

    return (
        <>
            <StyledAppBar position="fixed">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => setDrawerOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ ml: 2, color: '#00ffff' }}>
                        DecentraMind
                    </Typography>
                </Toolbar>
            </StyledAppBar>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        background: 'rgba(10, 10, 31, 0.95)',
                        backdropFilter: 'blur(10px)',
                        borderRight: '1px solid rgba(0,255,255,0.1)',
                        width: 250,
                    }
                }}
            >
                <List>
                    {navItems.map((item, index) => (
                        <NavMenuItem
                            key={item.path}
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            variants={menuVariants}
                        >
                            <NavItem
                                active={router.pathname === item.path}
                                onClick={() => {
                                    router.push(item.path);
                                    setDrawerOpen(false);
                                }}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.title} />
                            </NavItem>
                        </NavMenuItem>
                    ))}
                </List>
            </Drawer>
        </>
    );
};

export default Navigation; 