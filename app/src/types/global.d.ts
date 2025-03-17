declare module '*.css' {
    const content: { [className: string]: string };
    export default content;
}

declare module '*.json' {
    const value: any;
    export default value;
}

declare module '@solana/wallet-adapter-react-ui/styles.css';
declare module '@huggingface/inference';
declare module '../idl/decentramind';
declare module '@project-serum/anchor';
declare module '@solana/web3.js';
declare module '@solana/spl-token'; 