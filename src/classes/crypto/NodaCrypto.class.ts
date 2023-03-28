import crypto from 'node:crypto';
import type { INodaCrypto } from '../../interfaces/crypto/INodaCrypto.interface';

/**
 * A class that encapsulates encryption and decryption functionality using Node.js crypto module.
 */
export default class Nodacrypto implements INodaCrypto {
	private readonly _privateKey: string;
	private readonly _publicKey: string;

	/**
	 * Creates an instance of Nodacrypto and generates a new key pair.
	 * @remarks This constructor generates a new key pair using RSA encryption with a 2048-bit modulus length.
	 */
	constructor() {
		const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
			modulusLength: 2048, // The length of the key in bits.
			publicKeyEncoding: {
				type: 'spki', // The type of the key.
				format: 'pem' // The format of the key.
			},
			privateKeyEncoding: {
				type: 'pkcs8', // The type of the key.
				format: 'pem', // The format of the key.
				cipher: 'aes-256-cbc', // The algorithm used to encrypt the private key.
				passphrase: 'secret' // The passphrase used to encrypt the private key.
			}
		});
		this._privateKey = privateKey;
		this._publicKey = publicKey;
	}

	/**
	 * Decrypts a buffer of encrypted data using the private key.
	 * @param data - The encrypted data to decrypt.
	 * @returns The decrypted data.
	 */
	public decrypt(data: Buffer): Buffer {
		return crypto.privateDecrypt(this._privateKey, data);
	}

	/**
	 * Gets the public key for the Nodacrypto instance.
	 * @returns The public key.
	 */
	public getPublicKey(): string {
		return this._publicKey;
	}
}
