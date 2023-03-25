import type {
	DecodeData,
	HandleMessage,
	NodaBaseMessage,
	NodaContentType,
	NodaServerErrorHandler,
	NodaServerOptions,
	NodeSocket,
	SocketHandler
} from '../../types';
import { INodaSocketHandler } from '../../interfaces';
import { NodaError } from './NodaError.class';
import { NodaErrorEnum } from '../../enums';
import { randomUUID } from 'node:crypto';
import { RedisClientType } from 'redis';

export class NodaSocketHandler implements INodaSocketHandler {
	private _socketMap = new Map<string, NodeSocket>();
	private static readonly _handleMessageByMessageType: {
		[P in Exclude<NodaContentType, 'UNKNOWN'>]: HandleMessage;
	} = {
			CAST: NodaSocketHandler._handleCast,
			COMMIT: NodaSocketHandler._handleCommit,
			OBSERVE: NodaSocketHandler._handleObserve,
			PUBLISH: NodaSocketHandler._handlePublish
		};

	/**
	 *
	 * @param _redisClient
	 * @param _options
	 * @param _errorHandler
	 */
	constructor(
		private readonly _redisClient: RedisClientType,
		private readonly _options: NodaServerOptions,
		private readonly _errorHandler: NodaServerErrorHandler
	) {}

	/**
	 *
	 * @returns
	 */
	public getHandler(): (socket: NodeSocket) => void {
		return this._resolve;
	}

	/**
	 *
	 * @param socket
	 */
	private _resolve(socket: NodeSocket): void {
		socket.on('close', () => {
			socket.clientId && this._socketMap.delete(socket.clientId);
		});
		socket.on('connect', () => {
			socket.clientId = randomUUID();
			this._socketMap.set(socket.clientId, socket);
		});
		socket.on('data', (data) => {
			try {
				NodaSocketHandler.handleMessage(NodaSocketHandler.decodeData(data))(
					this._redisClient,
					this._options,
					this._errorHandler
				);
			} catch (_error) {
				this._errorHandler(new NodaError(_error));
			}
		});
		socket.on('timeout', () => null);
		socket.on('error', () => {
			socket.clientId && this._socketMap.delete(socket.clientId);
		});
	}

	/**
	 *
	 * @param data
	 * @returns
	 */
	private static decodeData: DecodeData = (data) => {
		const dataString = data.toString();
		try {
			return JSON.parse(dataString);
		} catch (_error) {
			throw new NodaError(NodaErrorEnum.DATA_INVALID, {
				cause: new NodaError(_error, { cause: dataString })
			});
		}
	};

	/**
	 *
	 * @param message
	 * @returns
	 */
	private static handleMessage: HandleMessage = (message: unknown) => {
		const messageType = (<NodaBaseMessage<'UNKNOWN'>>message)?.metadata?.type;
		if (
			!messageType ||
			!NodaSocketHandler._handleMessageByMessageType[messageType]
		)
			throw new NodaError(NodaErrorEnum.DATA_TYPE_INVALID, {
				cause: `type <${messageType || 'unknown'}> invalid`
			});
		return NodaSocketHandler._handleMessageByMessageType[messageType](message);
	};

	/**
	 *
	 * @param message
	 * @returns
	 */
	private static _handleCast(message: unknown): SocketHandler {
		message = message as NodaBaseMessage<'CAST'>;
		return (redisClient: RedisClientType, options: NodaServerOptions) => {
			console.log(message);
		};
	}

	/**
	 *
	 * @param message
	 * @returns
	 */
	private static _handleCommit(message: unknown): SocketHandler {
		message = message as NodaBaseMessage<'COMMIT'>;
		return (redisClient: RedisClientType, options: NodaServerOptions) => {
			console.log(message);
		};
	}

	/**
	 *
	 * @param message
	 * @returns
	 */
	private static _handleObserve(message: unknown): SocketHandler {
		message = message as NodaBaseMessage<'PUBLISH'>;
		return (redisClient: RedisClientType, options: NodaServerOptions) => {
			console.log(message);
		};
	}

	/**
	 *
	 * @param message
	 * @returns
	 */
	private static _handlePublish(message: unknown): SocketHandler {
		message = message as NodaBaseMessage<'OBSERVE'>;
		return (redisClient: RedisClientType, options: NodaServerOptions) => {
			console.log(message);
		};
	}
}
