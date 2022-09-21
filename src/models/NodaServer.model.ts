import { NodaError } from './NodaError.model';

export type NodaServerOptions = { dev: boolean };

export type NodaServerErrorHandler = (error: NodaError) => void;

export interface NodaServer {
	readonly onError: (errorHandler: NodaServerErrorHandler) => void;
	readonly open: () => Promise<void>;
	readonly close: () => Promise<void>;
}
