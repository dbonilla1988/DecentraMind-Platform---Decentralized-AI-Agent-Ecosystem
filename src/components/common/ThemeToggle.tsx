import React from 'react';
import { IconButton, useTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

interface ThemeToggleProps {
    onToggle: () => void;
}

const ThemeToggle = ({ onToggle }: ThemeToggleProps) => {
    const theme = useTheme();

    return (
        <IconButton onClick={onToggle} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
    );
};

export default ThemeToggle; 