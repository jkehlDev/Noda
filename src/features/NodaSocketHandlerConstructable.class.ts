import { Server, Socket } from 'node:net';
import { RedisClientType } from 'redis';
import {
	NodaServerErrorHandler,
	NodaServerOptions,
	NodaSocketHandler
} from '../models';

export class NodaSocketHandlerConstructable implements NodaSocketHandler {
	constructor(
		private readonly _redisClient: RedisClientType,
		private readonly _options: NodaServerOptions,
		private readonly _errorHandler: NodaServerErrorHandler
	) {}

	private resolve(socket: Socket): void {
		socket.on('close', () => null);
		socket.on('connect', () => null);
		socket.on('data', () => null);
		socket.on('timeout', () => null);
	}

	public getHandler(): (socket: Socket) => void {
		return this.resolve;
	}
}
