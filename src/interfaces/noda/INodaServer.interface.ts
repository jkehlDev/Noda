import { NodaServerErrorHandler } from '../../types';

export interface INodaServer {
	readonly onError: (errorHandler: NodaServerErrorHandler) => void;
	readonly open: () => void;
	readonly close: () => Promise<void>;
}
