import Nodacrypto from './NodaCrypto.class';

describe('Nodacrypto', () => {
	describe('constructor', () => {
		it('should generate a new key pair', () => {
			const nodacrypto = new Nodacrypto();
			expect(nodacrypto.getPublicKey()).toBeDefined();
		});
	});

	describe('decrypt', () => {
		it('should decrypt data encrypted with public key', () => {
			const nodacrypto = new Nodacrypto();
			const originalData = Buffer.from('secret message');
			const encryptedData = nodacrypto.encrypt(originalData);
			const decryptedData = nodacrypto.decrypt(encryptedData);
			expect(decryptedData).toEqual(originalData);
		});
	});
});
