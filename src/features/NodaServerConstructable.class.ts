import { createServer, Server } from 'node:net';
import { createClient, RedisClientType } from 'redis';
import { NodaErrorEnum } from '../enums';
import {
	NodaServer,
	NodaServerErrorHandler,
	NodaServerOptions
} from '../models';
import { NodaErrorConstructable } from './NodaErrorConstructable.class';
import { NodaSocketHandlerConstructable } from './NodaSocketHandlerConstructable.class';

export class NodaServerConstructable implements NodaServer {
	private static readonly NODA_OPTIONS_DEFAULT: NodaServerOptions = {
		dev: false
	};

	private readonly _options: NodaServerOptions;
	private readonly _baseServer: Server;
	private readonly _socketServer: Server;
	private _errorHandler: NodaServerErrorHandler = () => null;
	private readonly _redisClient: RedisClientType;

	constructor(server: Server, options?: Partial<NodaServerOptions>) {
		this._options = {
			...NodaServerConstructable.NODA_OPTIONS_DEFAULT,
			...options
		};
		this._redisClient = createClient();
		this._redisClient.on('error', (error) => {
			this._errorHandler(new NodaErrorConstructable(error));
		});
		this._baseServer = server;
		this._socketServer = createServer(
			new NodaSocketHandlerConstructable(
				this._redisClient,
				this._options,
				this._errorHandler
			).getHandler()
		);
		this._socketServer.on('error', (error) => {
			this._errorHandler(new NodaErrorConstructable(error));
		});
	}

	public onError(errorHandler: NodaServerErrorHandler) {
		this._errorHandler = errorHandler;
	}

	public async open(): Promise<void> {
		return this._redisClient
			.connect()
			.then(() => {
				this._socketServer.listen(this._baseServer);
			})
			.catch((_reason) => {
				if (_reason)
					throw new NodaErrorConstructable(NodaErrorEnum.OPEN_FAILED);
			});
	}

	public async close(): Promise<void> {
		return new Promise((resolve, reject) => {
			this._redisClient
				.disconnect()
				.then(() => {
					this._socketServer.close((_reason) => {
						if (_reason) {
							reject(
								new NodaErrorConstructable(NodaErrorEnum.CLOSE_FAILED, {
									cause: _reason
								})
							);
						} else {
							if (_reason) {
								reject(
									new NodaErrorConstructable(NodaErrorEnum.CLOSE_FAILED, {
										cause: _reason
									})
								);
							} else {
								resolve();
							}
						}
					});
				})
				.catch((_reason) => {
					if (_reason) {
						reject(
							new NodaErrorConstructable(NodaErrorEnum.CLOSE_FAILED, {
								cause: _reason
							})
						);
					}
				});
		});
	}
}
