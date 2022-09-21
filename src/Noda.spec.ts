import { createServer } from 'node:http';
import noda from './index';

describe('Verify JEST configuration running well', () => {
	it('Should open and close noda server without error', async () => {
		try {
			const server = createServer().listen(8124);
			const nodaServer = noda(server);
			await nodaServer.open();
			await nodaServer.close();
		} catch (_err) {
			expect(_err).toBe(undefined);
		}
	});
});
