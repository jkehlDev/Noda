import { NodaServer } from './NodaServer.class';
import { AbstractNodaSocketHandler, NodaError } from './';
import { Server } from 'node:http';
import { NodaErrorEnum } from '../../enums';

// Mock objects
const mockHttpServer = new Server();
mockHttpServer.listen(3000);
const errorHandler = jest.fn();
const mockSocketHandler = new (class extends AbstractNodaSocketHandler {
	protected _handleMessage() {
		return jest.fn();
	}

	protected _handleData() {
		return jest.fn();
	}
})({}, errorHandler);

const mockOptions = { dev: true };
const mockErrorHandler = jest.fn();

// Tests
describe('NodaServer', () => {
	let nodaServer: NodaServer;
	beforeEach(() => {
		jest.clearAllMocks();
		mockHttpServer.close();
		mockHttpServer.listen(3000);
		nodaServer = new NodaServer(mockHttpServer, mockSocketHandler, mockOptions);
	});

	describe('onError', () => {
		it('should set the error handler function', () => {
			nodaServer.onError(mockErrorHandler);
			expect((nodaServer as any)._errorHandler).toBe(mockErrorHandler);
		});
	});

	describe('open', () => {
		it('should start the server without throwing', () => {
			expect(() => nodaServer.open()).not.toThrow();
		});
	});

	describe('close', () => {
		it('should stop the server without throwing', async () => {
			nodaServer.open();
			await expect(nodaServer.close()).resolves.not.toThrow();
		});

		it('should throw an error if the server could not be stopped', async () => {
			const closeMock:
				| ((
						callback?: ((err?: Error | undefined) => void) | undefined
				  ) => Server)
				| undefined = (
					callback?: ((err?: Error | undefined) => void) | undefined
				) => {
					callback && callback(new Error('error'));
					return {} as Server;
				};

			jest
				.spyOn(nodaServer['_socketServer'], 'close')
				.mockImplementation(closeMock);

			nodaServer.open();

			await expect(nodaServer.close()).rejects.toMatchObject(
				new NodaError(NodaErrorEnum.CLOSE_FAILED, {
					cause: new Error('error')
				})
			);
		});
	});
});
