import { AbstractNodaSocketHandler } from './NodaSocketHandler.abstract';
import { NodaError } from './NodaError.class';

describe('AbstractNodaSocketHandler', () => {
	let socketHandler: AbstractNodaSocketHandler;
	const errorHandler = jest.fn();

	beforeEach(() => {
		socketHandler = new (class extends AbstractNodaSocketHandler {
			protected _handleMessage() {
				return jest.fn();
			}

			protected _handleData() {
				return jest.fn();
			}
		})({}, errorHandler);
	});

	describe('handle', () => {
		let mockSocket: any;

		beforeEach(() => {
			mockSocket = {
				on: jest.fn(),
				clientId: null
			};
		});

		it('should handle socket events', () => {
			// Act
			socketHandler.handle(mockSocket);

			// Assert
			expect(mockSocket.on).toHaveBeenCalledWith(
				'connect',
				expect.any(Function)
			);
			expect(mockSocket.on).toHaveBeenCalledWith('close', expect.any(Function));
			expect(mockSocket.on).toHaveBeenCalledWith(
				'message',
				expect.any(Function)
			);
			expect(mockSocket.on).toHaveBeenCalledWith('data', expect.any(Function));
			expect(mockSocket.on).toHaveBeenCalledWith(
				'timeout',
				expect.any(Function)
			);
			expect(mockSocket.on).toHaveBeenCalledWith('error', expect.any(Function));
		});

		it('removes the socket from the socket map on close', () => {
			mockSocket.clientId = 'client1';
			socketHandler['_socketMap'].set('client1', mockSocket);
			socketHandler.handle(mockSocket);
			expect(mockSocket.on).toHaveBeenCalledWith('close', expect.any(Function));
			mockSocket.on.mock.calls[0][1]();
			expect(socketHandler['_socketMap'].get('client1')).toBeUndefined();
		});

		it('handles errors and removes the socket from the socket map', () => {
			const mockError = new NodaError('Undefined client id');
			socketHandler['_handleError'] = jest.fn().mockReturnValue(jest.fn());
			socketHandler.handle(mockSocket);
			expect(mockSocket.on).toHaveBeenCalledWith('error', expect.any(Function));
			mockSocket.on.mock.calls[0][1](mockError);
			expect(socketHandler['_handleError']).toHaveBeenCalledWith(mockSocket);
			expect(errorHandler).toHaveBeenCalledWith(new NodaError(mockError));
			expect(
				socketHandler['_socketMap'].get(mockSocket.clientId)
			).toBeUndefined();
		});

		it('does not remove the socket if there is no client id', () => {
			mockSocket.clientId = null;
			socketHandler.handle(mockSocket);
			expect(mockSocket.on).toHaveBeenCalledWith('close', expect.any(Function));
			mockSocket.on.mock.calls[0][1]();
			expect(errorHandler).toHaveBeenCalledWith(
				new NodaError('Undefined client id')
			);
		});
	});
});
