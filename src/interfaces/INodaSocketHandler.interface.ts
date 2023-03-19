import { NodeSocket } from '../types';

export interface INodaSocketHandler {
	readonly getHandler: () => (socket: NodeSocket) => void;
}
