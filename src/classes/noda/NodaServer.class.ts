import type { NodaServerErrorHandler, NodaServerOptions } from '../../types';
import { createClient, RedisClientType } from 'redis';
import { createServer, Server } from 'node:net';
import { INodaServer } from '../../interfaces';
import { NodaError } from './NodaError.class';
import { NodaErrorEnum } from '../../enums';
import { NodaSocketHandler } from './NodaSocketHandler.class';

export class NodaServer implements INodaServer {
	private static readonly NODA_OPTIONS_DEFAULT: NodaServerOptions = {
		dev: false
	};

	private readonly _options: NodaServerOptions;
	private readonly _httpServer: Server;
	private readonly _socketServer: Server;
	private _errorHandler: NodaServerErrorHandler = () => null;
	private readonly _redisClient: RedisClientType;

	/**
	 *
	 * @param server
	 * @param options
	 */
	constructor(server: Server, options?: Partial<NodaServerOptions>) {
		this._options = {
			...NodaServer.NODA_OPTIONS_DEFAULT,
			...options
		};
		this._redisClient = createClient();
		this._redisClient.on('error', (error) => {
			this._errorHandler(new NodaError(error));
		});
		this._httpServer = server;
		this._socketServer = createServer(
			new NodaSocketHandler(
				this._redisClient,
				this._options,
				this._errorHandler
			).getHandler()
		);
		this._socketServer.on('error', (error) => {
			this._errorHandler(new NodaError(error));
		});
	}

	/**
	 *
	 * @param errorHandler
	 */
	public onError(errorHandler: NodaServerErrorHandler) {
		this._errorHandler = errorHandler;
	}

	/**
	 *
	 * @returns
	 */
	public async open(): Promise<void> {
		return this._redisClient
			.connect()
			.then(() => {
				this._socketServer.listen(this._httpServer);
			})
			.catch((_reason) => {
				if (_reason) throw new NodaError(NodaErrorEnum.OPEN_FAILED);
			});
	}

	/**
	 *
	 * @returns
	 */
	public async close(): Promise<void> {
		return new Promise((resolve, reject) => {
			this._redisClient
				.disconnect()
				.then(() => {
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
				})
				.catch((_reason) => {
					if (_reason) {
						reject(
							new NodaError(NodaErrorEnum.CLOSE_FAILED, {
								cause: _reason
							})
						);
					}
				});
		});
	}
}
