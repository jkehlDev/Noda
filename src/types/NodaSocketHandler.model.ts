import { Socket } from 'node:net';
export type NodeSocket = Socket & { clientId?: string };
