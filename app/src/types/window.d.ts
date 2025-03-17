interface Window {
    solana?: {
        isPhantom?: boolean;
        connect: () => Promise<void>;
        disconnect: () => Promise<void>;
    }
} 