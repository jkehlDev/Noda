/**
 * Interface that defines the signature for a middleware function.
 */
export type NodaMiddleware<T> = (
	input: T,
	next: () => Promise<void>
) => Promise<void>;
