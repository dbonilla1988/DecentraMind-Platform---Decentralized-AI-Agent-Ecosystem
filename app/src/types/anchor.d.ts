declare module '@project-serum/anchor' {
    import { PublicKey } from '@solana/web3.js';

    export interface Wallet {
        publicKey: PublicKey;
        payer: any;
        signTransaction: any;
        signAllTransactions: any;
    }

    export interface Provider {
        connection: any;
        wallet: Wallet;
    }

    export interface Program<T> {
        programId: PublicKey;
        provider: Provider;
        rpc: any;
        account: any;
        methods: any;
    }

    export class AnchorProvider implements Provider {
        connection: any;
        wallet: Wallet;
        static defaultOptions(): any;
    }
}

declare module '@solana/web3.js' {
    export class PublicKey {
        constructor(key: string);
        toBuffer(): Buffer;
        toString(): string;
    }
}

declare module '@solana/spl-token' {
    export const TOKEN_PROGRAM_ID: any;
    export function createMint(...args: any[]): Promise<any>;
} 