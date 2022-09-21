import { Socket } from 'node:net';

export interface NodaSocketHandler {
	readonly getHandler: () => (socket: Socket) => void;
}
