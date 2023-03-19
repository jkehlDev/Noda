import { Server } from 'node:net';
import { NodaServer } from './classes';
import { INodaServer } from './interfaces';
import { NodaServerOptions } from './types/NodaServer.model';

export * from './enums';

export * from './interfaces';

export default (server: Server, options?: NodaServerOptions): INodaServer =>
	new NodaServer(server, options);
