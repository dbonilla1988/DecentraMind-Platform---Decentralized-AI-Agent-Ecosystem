import React, { useState } from 'react';
import { Button, Menu, MenuItem, Box, Typography } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const WalletConnection: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleConnect = () => {
        // Implement wallet connection logic here
        setIsConnected(true);
        setWalletAddress('Demo...xyz');
        handleClose();
    };

    return (
        <Box>
            <Button
                variant="contained"
                onClick={handleClick}
                startIcon={<AccountBalanceWalletIcon />}
                sx={{
                    background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
                    color: '#fff',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #ff00ff, #00ffff)',
                    }
                }}
            >
                {isConnected ? `Connected: ${walletAddress.slice(0, 4)}...${walletAddress.slice(-3)}` : 'Connect Wallet'}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        background: 'rgba(10, 10, 31, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(0,255,255,0.1)',
                    }
                }}
            >
                <MenuItem onClick={handleConnect}>
                    <Typography sx={{ color: '#fff' }}>Phantom</Typography>
                </MenuItem>
                <MenuItem onClick={handleConnect}>
                    <Typography sx={{ color: '#fff' }}>Solflare</Typography>
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default WalletConnection; 