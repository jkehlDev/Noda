import { NodaServer } from './NodaServer.class';
import { createServer, Server } from 'node:net';
import { NodaServerErrorHandler, NodaServerOptions } from '../../types';
import { AbstractNodaSocketHandler } from './NodaSocketHandler.abstract';

describe('NodaServer', () => {
	let server: Server;
	let socketHandler: AbstractNodaSocketHandler;
	const errorHandler = jest.fn();
	let options: Partial<NodaServerOptions>;

	beforeEach(() => {
		jest.clearAllMocks();
		server = createServer().listen(8124);
		socketHandler = socketHandler =
			new (class extends AbstractNodaSocketHandler {
				protected _handleMessage() {
					return jest.fn();
				}

				protected _handleData() {
					return jest.fn();
				}
			})({}, errorHandler);
		options = { dev: true };
	});

	afterEach(() => {
		server.close();
	});

	describe('constructor', () => {
		it('should create a new instance of NodaServer', () => {
			const nodaServer = new NodaServer(server, socketHandler, options);
			expect(nodaServer).toBeInstanceOf(NodaServer);
		});
	});

	describe('onError', () => {
		it('should set the error handler function for the NodaServer instance', () => {
			const nodaServer = new NodaServer(server, socketHandler, options);

			const errorHandler: NodaServerErrorHandler = () =>
				console.log('Error handled!');
			nodaServer.onError(errorHandler);
			expect(nodaServer['_errorHandler']).toBe(errorHandler);
		});
	});

	describe('open', () => {
		it('should open the HTTP and WebSocket servers', async () => {
			const nodaServer = new NodaServer(server, socketHandler, options);
			await nodaServer.open();
			expect(nodaServer['_socketServer'].listening).toBe(true);
		});
	});

	describe('NodaServer close method', () => {
		it('should close the HTTP and WebSocket servers and resolve', async () => {
			const nodaServer = new NodaServer(server, socketHandler, options);
			jest
				.spyOn(nodaServer['_socketServer'], 'close')
				.mockImplementationOnce((callback?: (err?: Error) => void) => {
					if (callback) {
						callback(undefined);
					}
					return {} as Server;
				});
			await expect(nodaServer.close()).resolves.toBeUndefined();
		});

		it('should reject with a NodaError when WebSocket server fails to close', async () => {
			const nodaServer = new NodaServer(server, socketHandler, options);
			const error = new Error('WebSocket server error');
			jest
				.spyOn(nodaServer['_socketServer'], 'close')
				.mockImplementationOnce((callback?: (error?: Error) => void) => {
					if (callback) {
						callback(error);
					}
					return {} as Server;
				});
			await expect(nodaServer.close()).rejects.toEqual({
				cause: undefined,
				code: 500,
				message: 'Open Failed',
				name: 'NodaError',
				originalCode: 500,
				originalName: 'NodaError',
				stack: undefined
			});
		});
	});
});
