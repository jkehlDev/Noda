export type NodaErrorOptions = {
	cause?: unknown;
	name?: string;
	code?: number;
	stack?: string;
};

export interface NodaError extends Error {
	readonly message: string;
	readonly code: number;
	readonly name: string;
	readonly cause?: NodaError;
	readonly stack?: string;
	readonly originalCode: number;
	readonly originalName: string;
	readonly toString: () => string;
}
