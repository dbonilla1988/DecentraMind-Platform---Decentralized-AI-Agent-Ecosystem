import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2196F3',
            light: '#64B5F6',
            dark: '#1976D2',
        },
        secondary: {
            main: '#FF4081',
            light: '#FF80AB',
            dark: '#F50057',
        },
        background: {
            default: '#F5F5F5',
            paper: '#FFFFFF',
        },
    },
    typography: {
        h1: {
            fontWeight: 600,
        },
        h2: {
            fontWeight: 600,
        },
        h3: {
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
    },
});

export default theme; 