import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';
import { WalletContextProvider } from '../components/WalletProvider';

const theme = createTheme();

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <WalletContextProvider>
                <Component {...pageProps} />
            </WalletContextProvider>
        </ThemeProvider>
    );
} 