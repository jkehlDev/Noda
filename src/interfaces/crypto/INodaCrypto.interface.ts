/**
 * Interface that defines the methods exposed by the Nodacrypto class.
 */
export interface INodaCrypto {
	/**
	 * Decrypts a buffer of encrypted data using the private key.
	 * @param data - The encrypted data to decrypt.
	 * @returns The decrypted data.
	 */
	decrypt(data: Buffer): Buffer;

	/**
	 * Gets the public key for the Nodacrypto instance.
	 * @returns The public key.
	 */
	getPublicKey(): string;
}
