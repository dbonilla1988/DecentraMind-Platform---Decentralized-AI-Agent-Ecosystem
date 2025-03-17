import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createMint } from "@solana/spl-token";
import { IDL } from "../target/types/decentramind";

async function main() {
    // Configure the client
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    // Generate DMT token mint
    const dmtMintKeypair = Keypair.generate();
    const dmtMint = await createMint(
        provider.connection,
        provider.wallet.payer,
        provider.wallet.publicKey,
        null,
        9, // 9 decimals
        dmtMintKeypair
    );

    console.log("DMT Token Mint created:", dmtMint.toString());

    // Deploy the program
    const program = new Program(IDL, new PublicKey("your_program_id"), provider);

    // Initialize DecentraMind pool
    const [decentraMindPool] = PublicKey.findProgramAddressSync(
        [Buffer.from("decentramind_pool")],
        program.programId
    );

    const [stakeVault] = PublicKey.findProgramAddressSync(
        [Buffer.from("stake_vault"), dmtMint.toBuffer()],
        program.programId
    );

    const [treasuryWallet] = PublicKey.findProgramAddressSync(
        [Buffer.from("treasury")],
        program.programId
    );

    try {
        await program.methods
            .initialize()
            .accounts({
                decentraMindPool,
                stakeVault,
                treasuryWallet,
                authority: provider.wallet.publicKey,
                dmtMint,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        console.log("DecentraMind program deployed successfully!");
        console.log("Pool:", decentraMindPool.toString());
        console.log("Treasury:", treasuryWallet.toString());
    } catch (error) {
        console.error("Error deploying program:", error);
    }
}

main().then(
    () => process.exit(),
    err => {
        console.error(err);
        process.exit(-1);
    },
); 