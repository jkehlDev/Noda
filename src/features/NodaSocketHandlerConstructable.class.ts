import { Server, Socket } from 'node:net';
import { RedisClientType } from 'redis';
import {
	NodaBaseMessage,
	NodaCastMessage,
	NodaCommitMessage,
	NodaObserveMessage,
	NodaPublishMessage,
	NodaServerErrorHandler,
	NodaServerOptions,
	NodaSocketHandler,
	NodaTypeMessages
} from '../models';
import { NodaErrorConstructable } from './NodaErrorConstructable.class';

export class NodaSocketHandlerConstructable implements NodaSocketHandler {
	constructor(
		private readonly _redisClient: RedisClientType,
		private readonly _options: NodaServerOptions,
		private readonly _errorHandler: NodaServerErrorHandler
	) {}

	private resolve(socket: Socket): void {
		socket.on('close', () => null);
		socket.on('connect', () => null);
		socket.on('data', (data) => {
			try {
				handleMessage(decodeData(data))(
					this._redisClient,
					this._options,
					this._errorHandler
				);
			} catch (_error) {
				this._errorHandler(new NodaErrorConstructable(_error));
			}
		});
		socket.on('timeout', () => null);
	}

	public getHandler(): (socket: Socket) => void {
		return this.resolve;
	}
}
type DecodeData = (data: Buffer) => NodaBaseMessage<NodaTypeMessages>;
const decodeData: DecodeData = (data) => {
	try {
		return JSON.parse(data.toString());
	} catch (_error) {
		throw new NodaErrorConstructable('Failed to decode incoming data buffer', {
			cause: _error
		});
	}
};

type HandleMessage<T extends NodaTypeMessages> = (
	message: NodaBaseMessage<T>
) => (
	redisClient: RedisClientType,
	options: NodaServerOptions,
	errorHandler: NodaServerErrorHandler
) => void;
const handleMessage: HandleMessage<NodaTypeMessages> = (message) => {
	switch (message.metadata.type) {
	case 'CAST':
		return handleCast(<NodaCastMessage>message);
	case 'COMMIT':
		return handleCommit(<NodaCommitMessage>message);
	case 'OBSERVE':
		return handleObserve(<NodaObserveMessage>message);
	case 'PUBLISH':
		return handlePublish(<NodaPublishMessage>message);
	default:
		throw new NodaErrorConstructable('Unknown message type', {
			cause: `type <${message.metadata.type}> not available`
		});
	}
};

const handleCast: HandleMessage<'CAST'> =
	(message) => (redisClient: RedisClientType, options: NodaServerOptions) => {
		console.log(message);
	};

const handleCommit: HandleMessage<'COMMIT'> =
	(message) => (redisClient: RedisClientType, options: NodaServerOptions) => {
		console.log(message);
	};

const handleObserve: HandleMessage<'OBSERVE'> =
	(message) => (redisClient: RedisClientType, options: NodaServerOptions) => {
		console.log(message);
	};

const handlePublish: HandleMessage<'PUBLISH'> =
	(message) => (redisClient: RedisClientType, options: NodaServerOptions) => {
		console.log(message);
	};
