import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { WalletContextProvider } from '../components/WalletProvider';

const theme = createTheme({
    // Your theme configuration
});

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <WalletContextProvider>
                <Component {...pageProps} />
            </WalletContextProvider>
        </ThemeProvider>
    );
}

export default MyApp; 