import { Server } from 'node:net';
import { AbstractNodaSocketHandler, NodaServer } from './classes/noda';
import { INodaServer } from './interfaces/noda';
import { NodaServerOptions } from './types/';

export * from './enums';
export * from './interfaces/noda';

export default (
	server: Server,
	socketHandler: AbstractNodaSocketHandler,
	options?: NodaServerOptions
): INodaServer => new NodaServer(server, socketHandler, options);
