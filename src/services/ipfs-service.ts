import { create } from 'ipfs-http-client';
import CryptoJS from 'crypto-js';

export class IPFSService {
    private ipfs;
    private encryptionKey: string;

    constructor() {
        // Connect to Infura's IPFS gateway
        this.ipfs = create({
            host: 'ipfs.infura.io',
            port: 5001,
            protocol: 'https'
        });
        // Generate a random encryption key for this session
        this.encryptionKey = CryptoJS.lib.WordArray.random(32).toString();
    }

    async uploadFile(file: File): Promise<{ cid: string; encryptedKey: string }> {
        try {
            // Read file as buffer
            const buffer = await file.arrayBuffer();

            // Encrypt file content
            const encryptedContent = CryptoJS.AES.encrypt(
                Buffer.from(buffer).toString('base64'),
                this.encryptionKey
            ).toString();

            // Upload encrypted content to IPFS
            const result = await this.ipfs.add(Buffer.from(encryptedContent));

            // Encrypt the encryption key with user's public key (for demo using a fixed key)
            const encryptedKey = CryptoJS.AES.encrypt(
                this.encryptionKey,
                'USER_PUBLIC_KEY'
            ).toString();

            return {
                cid: result.path,
                encryptedKey
            };
        } catch (error) {
            console.error('Error uploading to IPFS:', error);
            throw error;
        }
    }

    async downloadFile(cid: string, encryptedKey: string): Promise<ArrayBuffer> {
        try {
            // Fetch encrypted content from IPFS
            const chunks = [];
            for await (const chunk of this.ipfs.cat(cid)) {
                chunks.push(chunk);
            }
            const encryptedContent = Buffer.concat(chunks).toString();

            // Decrypt the encryption key
            const decryptedKey = CryptoJS.AES.decrypt(
                encryptedKey,
                'USER_PUBLIC_KEY'
            ).toString(CryptoJS.enc.Utf8);

            // Decrypt the content
            const decryptedContent = CryptoJS.AES.decrypt(
                encryptedContent,
                decryptedKey
            ).toString(CryptoJS.enc.Utf8);

            // Convert back to ArrayBuffer
            return Buffer.from(decryptedContent, 'base64');
        } catch (error) {
            console.error('Error downloading from IPFS:', error);
            throw error;
        }
    }
} 