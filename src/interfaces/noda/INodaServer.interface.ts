import { NodaServerErrorHandler } from '../../types';

export interface INodaServer {
	readonly onError: (errorHandler: NodaServerErrorHandler) => void;
	readonly open: () => Promise<void>;
	readonly close: () => Promise<void>;
}
