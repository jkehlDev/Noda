import type {
	NodaServerErrorHandler,
	NodaServerOptions,
	NodeSocket
} from '../../types';
import type { INodaSocketHandler } from '../../interfaces';
import { NodaError } from './NodaError.class';
import { randomUUID } from 'node:crypto';

/**
 * Abstract class for handling socket connections.
 */
export abstract class AbstractNodaSocketHandler implements INodaSocketHandler {
	private _socketMap = new Map<string, NodeSocket>();

	/**
	 * Creates a new instance of `AbstractNodaSocketHandler`.
	 * @param _options - The server options.
	 * @param _errorHandler - The error handler function.
	 */
	constructor(
		private readonly _options: NodaServerOptions,
		private readonly _errorHandler: NodaServerErrorHandler
	) {}

	/**
	 * Handles a new socket connection.
	 * @param socket - The new socket connection.
	 */
	public handle(socket: NodeSocket): void {
		// Add event listeners for socket events
		socket.on('close', this._removeClient(socket));
		socket.on('connect', () => {
			socket.clientId = randomUUID();
			this._socketMap.set(socket.clientId, socket);
		});
		socket.on('message', this._handleMessage(socket));
		socket.on('data', this._handleData(socket));
		socket.on('timeout', this._removeClient(socket));
		socket.on('error', this._handleError(socket));
	}

	/**
	 * Removes a client socket from the map of active connections.
	 * @param socket - The socket to remove.
	 * @returns A function to remove the client socket from the map.
	 */
	private _removeClient(socket: NodeSocket) {
		return () =>
			socket.clientId
				? this._socketMap.delete(socket.clientId)
				: this._errorHandler(new NodaError('Undefined client id'));
	}

	/**
	 * Handles an error event on the socket.
	 * @param socket - The socket that encountered the error.
	 * @returns A function to handle the error event.
	 */
	private _handleError(socket: NodeSocket) {
		return (error: unknown) => {
			// Handle the error
			this._errorHandler(new NodaError(error));
			// Remove the client from the map if it exists
			this._removeClient(socket);
		};
	}

	/**
	 * Handles a new message event on the socket.
	 * This method is implemented by subclasses.
	 * @param socket - The socket that received the message.
	 * @returns A function to handle the message event.
	 */
	protected abstract _handleMessage(socket: NodeSocket): (data: Buffer) => void;

	/**
	 * Handles a new data event on the socket.
	 * This method is implemented by subclasses.
	 * @param socket - The socket that received the data.
	 * @returns A function to handle the data event.
	 */
	protected abstract _handleData(socket: NodeSocket): (data: Buffer) => void;
}
