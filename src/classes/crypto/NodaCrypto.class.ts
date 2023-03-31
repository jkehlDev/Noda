import crypto, { randomUUID } from 'node:crypto';
import type { INodaCrypto } from '../../interfaces/crypto/INodaCrypto.interface';

/**
 * A class that encapsulates encryption and decryption functionality using Node.js crypto module.
 */
export default class Nodacrypto implements INodaCrypto {
	private readonly _privateKey: string;
	private readonly _publicKey: string;
	private readonly _passphrase: string;

	/**
	 * Creates an instance of Nodacrypto and generates a new key pair.
	 * @remarks This constructor generates a new key pair using RSA encryption with a 2048-bit modulus length.
	 */
	constructor() {
		this._passphrase = randomUUID();
		const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
			modulusLength: 4096, // The length of the key in bits.
			publicKeyEncoding: {
				type: 'spki', // The type of the key.
				format: 'pem' // The format of the key.
			},
			privateKeyEncoding: {
				type: 'pkcs8', // The type of the key.
				format: 'pem', // The format of the key.
				cipher: 'aes-256-cbc', // The algorithm used to encrypt the private key.
				passphrase: this._passphrase // The passphrase used to encrypt the private key.
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
		return crypto.privateDecrypt(
			{ key: this._privateKey, passphrase: this._passphrase },
			data
		);
	}

	/**
	 * Encrypts a buffer data using the public key.
	 * @param data - The data to encrypt.
	 * @returns The encrypted data.
	 */
	public encrypt(data: Buffer): Buffer {
		return crypto.publicEncrypt(this._publicKey, data);
	}

	/**
	 * Gets the public key for the Nodacrypto instance.
	 * @returns The public key.
	 */
	public getPublicKey(): string {
		return this._publicKey;
	}
}
