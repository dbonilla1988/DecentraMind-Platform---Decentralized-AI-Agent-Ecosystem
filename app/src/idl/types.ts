import { Program } from '@project-serum/anchor';
import { IDL } from './decentramind';

export type DecentraMindIDL = typeof IDL;
export type DecentraMindProgram = Program<DecentraMindIDL>; 