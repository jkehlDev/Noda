import { INodaError } from '../../interfaces';

export type NodaServerOptions = { dev?: boolean };
export type NodaServerErrorHandler = (error: INodaError) => void;
