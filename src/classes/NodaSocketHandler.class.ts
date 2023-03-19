import { randomUUID } from 'node:crypto';
import { RedisClientType } from 'redis';
import { NodaErrorEnum } from '../enums';
import { INodaSocketHandler } from '../interfaces';
import {
	DecodeData,
	HandleMessage,
	NodaBaseMessage,
	NodaServerErrorHandler,
	NodaServerOptions,
	NodaTypeMessages,
	NodeSocket,
	SocketHandler
} from '../types';
import { NodaError } from './NodaError.class';

export class NodaSocketHandler implements INodaSocketHandler {
	private _socketMap = new Map<string, NodeSocket>();
	private static readonly _handleMessageByMessageType: {
		[P in NodaTypeMessages]: HandleMessage;
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
	private static handleMessage: HandleMessage = (
		message: NodaBaseMessage<unknown>
	) => {
		if (
			message?.metadata?.type ||
			!NodaSocketHandler._handleMessageByMessageType[message.metadata.type]
		)
			throw new NodaError(NodaErrorEnum.DATA_TYPE_INVALID, {
				cause: `type <${message?.metadata?.type || 'unknown'}> invalid`
			});
		return NodaSocketHandler._handleMessageByMessageType[message.metadata.type](
			message
		);
	};

	/**
	 *
	 * @param message
	 * @returns
	 */
	private static _handleCast(message: NodaBaseMessage<unknown>): SocketHandler {
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
	private static _handleCommit(
		message: NodaBaseMessage<unknown>
	): SocketHandler {
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
	private static _handleObserve(
		message: NodaBaseMessage<unknown>
	): SocketHandler {
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
	private static _handlePublish(
		message: NodaBaseMessage<unknown>
	): SocketHandler {
		message = message as NodaBaseMessage<'OBSERVE'>;
		return (redisClient: RedisClientType, options: NodaServerOptions) => {
			console.log(message);
		};
	}
}
