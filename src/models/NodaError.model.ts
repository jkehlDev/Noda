export type NodaErrorOptions = {
	cause?: unknown;
	name?: string;
	code?: number;
	stack?: string;
};

export interface NodaError extends Error {
	readonly message: string;
	readonly name: string;
	readonly cause?: NodaError;
	readonly code?: number;
	readonly stack?: string;
	readonly toString: () => string;
}
