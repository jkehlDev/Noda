import { Socket } from 'node:net';
import { RedisClientType } from 'redis';
import { NodaBaseMessage, NodaTypeMessages } from './NodaBaseMessage.model';
import { NodaServerErrorHandler, NodaServerOptions } from './NodaServer.model';

export type NodeSocket = Socket & { clientId?: string };
export type DecodeData = (data: Buffer) => NodaBaseMessage<NodaTypeMessages>;
export type HandleMessage = (
	message: NodaBaseMessage<unknown>
) => (
	redisClient: RedisClientType,
	options: NodaServerOptions,
	errorHandler: NodaServerErrorHandler
) => void;
export type SocketHandler = (
	redisClient: RedisClientType,
	options: NodaServerOptions,
	errorHandler: NodaServerErrorHandler
) => void;
