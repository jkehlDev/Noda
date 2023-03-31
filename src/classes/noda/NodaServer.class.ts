import type { NodaServerErrorHandler, NodaServerOptions } from '../../types';
import { createServer, Server } from 'node:net';
import { INodaServer } from '../../interfaces';
import { NodaError } from './NodaError.class';
import { NodaErrorEnum } from '../../enums';
import { AbstractNodaSocketHandler } from './NodaSocketHandler.abstract';

/**
 * NodaServer class to manage HTTP and WebSocket servers.
 */
export class NodaServer implements INodaServer {
	/**
	 * Default options for the NodaServer class.
	 */
	private static readonly NODA_OPTIONS_DEFAULT: NodaServerOptions = {
		dev: false
	};

	/**
	 * Options passed to the constructor.
	 */
	private readonly _options: NodaServerOptions;

	/**
	 * The WebSocket server instance.
	 */
	private readonly _socketServer: Server;

	/**
	 * The error handler function.
	 */
	private _errorHandler: NodaServerErrorHandler = () => null;

	/**
	 * Creates a new instance of NodaServer.
	 *
	 * @param server The HTTP server instance.
	 * @param socketHandler The socket handler.
	 * @param options Options for the NodaServer class.
	 */
	constructor(
		private readonly _httpServer: Server,
		socketHandler: AbstractNodaSocketHandler,
		options?: Partial<NodaServerOptions>
	) {
		this._options = {
			...NodaServer.NODA_OPTIONS_DEFAULT,
			...options
		};

		this._socketServer = createServer(socketHandler.handle);

		// Set up the WebSocket server error handler.
		this._socketServer.on('error', (error) => {
			this._errorHandler(new NodaError(error));
		});
	}

	/**
	 * Sets the error handler function for the NodaServer instance.
	 *
	 * @param errorHandler The error handler function.
	 */
	public onError(errorHandler: NodaServerErrorHandler) {
		this._errorHandler = errorHandler;
	}

	/**
	 * Opens the HTTP and WebSocket servers.
	 */
	public open(): void {
		try {
			this._socketServer.listen(this._httpServer);
		} catch (error) {
			throw new NodaError(NodaErrorEnum.OPEN_FAILED, { cause: error });
		}
	}

	/**
	 * Closes the HTTP and WebSocket servers.
	 *
	 * @returns Promise that resolves when the servers are closed.
	 */
	public async close(): Promise<void> {
		return await new Promise((resolve, reject) => {
			this._socketServer.close((_reason) => {
				if (_reason) {
					
					reject(
						new NodaError(NodaErrorEnum.CLOSE_FAILED, {
							cause: _reason
						})
					);
				} else {
					resolve();
				}
			});
		});
	}
}
