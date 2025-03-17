import { FC, ReactNode, useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { clusterApiUrl } from '@solana/web3.js';
import dynamic from 'next/dynamic';

require('@solana/wallet-adapter-react-ui/styles.css');

interface Props {
    children: ReactNode;
}

// Create a dynamic wrapper component to handle client-side only components
const WalletComponent: FC<Props> = ({ children }) => {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(
        () => [new PhantomWalletAdapter()],
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

// Export a dynamic component that only renders on the client
export const WalletContextProvider = dynamic(
    () => Promise.resolve(WalletComponent),
    {
        ssr: false,
    }
); 