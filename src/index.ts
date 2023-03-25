import { Server } from 'node:net';
import { NodaServer } from './classes/noda';
import { INodaServer } from './interfaces/noda';
import { NodaServerOptions } from './types/';

export * from './enums';

export * from './interfaces/noda';

export default (server: Server, options?: NodaServerOptions): INodaServer =>
	new NodaServer(server, options);
