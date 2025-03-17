import React, { FC, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import BN from 'bn.js';
import { IDL } from '../idl/decentramind';
import type { DecentraMindIDL } from '../types/program';

interface TransactionWithSignature extends Transaction {
    sign(): Promise<void>;
}

const PROGRAM_ID = new PublicKey(process.env.REACT_APP_PROGRAM_ID || '');
const DMT_MINT = new PublicKey(process.env.REACT_APP_DMT_MINT || '');

export const StakeForm: FC = () => {
    const [amount, setAmount] = useState('');
    const { connection } = useConnection();
    const { publicKey, signTransaction } = useWallet();

    const handleStake = async () => {
        if (!publicKey || !signTransaction) return;

        try {
            const provider = new AnchorProvider(
                connection,
                {
                    publicKey,
                    signTransaction,
                    signAllTransactions: async (txs: Transaction[]) => {
                        return Promise.all(txs.map((tx: Transaction) => signTransaction(tx)));
                    }
                },
                AnchorProvider.defaultOptions()
            );

            const program = new Program<DecentraMindIDL>(
                IDL,
                PROGRAM_ID,
                provider
            );

            const stakeAmount = new BN(Number(amount) * 1e9); // Convert to lamports

            // Derive PDAs
            const [stakeAccount] = PublicKey.findProgramAddressSync(
                [Buffer.from("stake_account"), publicKey.toBuffer()],
                program.programId
            );

            const [stakeVault] = PublicKey.findProgramAddressSync(
                [Buffer.from("stake_vault"), DMT_MINT.toBuffer()],
                program.programId
            );

            // Get user's DMT token account
            const userTokenAccount = await program.provider.connection.getTokenAccountsByOwner(
                publicKey,
                { mint: DMT_MINT }
            );

            const tx = await program.methods
                .stake(stakeAmount)
                .accounts({
                    user: publicKey,
                    stakeAccount,
                    userTokenAccount: userTokenAccount.value[0].pubkey,
                    stakeVault,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    systemProgram: SystemProgram.programId,
                })
                .transaction();

            await signTransaction(tx);
            console.log("Staking transaction sent!");
        } catch (error) {
            console.error('Error staking:', error);
        }
    };

    return (
        <div className="stake-form">
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount of DMT to stake"
                min="0"
            />
            <button
                onClick={handleStake}
                disabled={!publicKey || !amount}
            >
                Stake DMT
            </button>
        </div>
    );
}; 