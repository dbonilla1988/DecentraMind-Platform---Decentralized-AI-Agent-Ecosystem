import { PublicKey } from '@solana/web3.js';
import { Program, Provider } from '@project-serum/anchor';
import { IDL } from '../idl/decentramind';

export interface DecentraMindIDL {
    version: string;
    name: string;
    instructions: any[];
    accounts: any[];
    types: any[];
}

export type DecentraMindProgram = Program<DecentraMindIDL>; 