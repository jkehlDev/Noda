import { Server } from 'node:net';
import { NodaServerConstructable } from './features';
import { NodaServer, NodaServerOptions } from './models';

export * from './enums';

export * from './models';

export default (server: Server, options?: NodaServerOptions): NodaServer =>
	new NodaServerConstructable(server, options);
