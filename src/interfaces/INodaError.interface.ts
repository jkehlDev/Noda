export interface INodaError extends Error {
	readonly message: string;
	readonly code: number;
	readonly name: string;
	readonly cause?: INodaError;
	readonly stack?: string;
	readonly originalCode: number;
	readonly originalName: string;
	readonly toString: () => string;
}
