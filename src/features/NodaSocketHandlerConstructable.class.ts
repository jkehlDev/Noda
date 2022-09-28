import { randomUUID } from 'node:crypto';
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
	NodaTypeMessages,
	NodeSocket
} from '../models';
import { NodaErrorConstructable } from './NodaErrorConstructable.class';

export class NodaSocketHandlerConstructable implements NodaSocketHandler {
	private _socketMap = new Map<string, NodeSocket>();

	constructor(
		private readonly _redisClient: RedisClientType,
		private readonly _options: NodaServerOptions,
		private readonly _errorHandler: NodaServerErrorHandler
	) {}

	private resolve(socket: NodeSocket): void {
		socket.on('close', () => {
			socket.clientId && this._socketMap.delete(socket.clientId);
		});
		socket.on('connect', () => {
			socket.clientId = randomUUID();
			this._socketMap.set(socket.clientId, socket);
		});
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
		socket.on('error', () => {
			socket.clientId && this._socketMap.delete(socket.clientId);
		});
	}

	public getHandler(): (socket: NodeSocket) => void {
		return this.resolve;
	}
}
type DecodeData = (data: Buffer) => NodaBaseMessage<NodaTypeMessages>;
const decodeData: DecodeData = (data) => {
	const dataString = data.toString();
	try {
		return JSON.parse(dataString);
	} catch (_error) {
		throw new NodaErrorConstructable('Failed to parse incoming data buffer', {
			cause: new NodaErrorConstructable(_error, { cause: dataString })
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
