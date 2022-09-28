import { Socket } from 'node:net';

export interface NodaSocketHandler {
	readonly getHandler: () => (socket: NodeSocket) => void;
}

export type NodeSocket = Socket & { clientId?: string };
