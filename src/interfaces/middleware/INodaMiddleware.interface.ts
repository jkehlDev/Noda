import type { NodaMiddleware } from '../../types/middleware/NodaMiddleware.type';

/**
 * Interface that defines the signature for a middleware chain.
 */
export interface INodaMiddlewareChain<T> {
	/**
	 * Adds a new middleware function to the chain.
	 * @param middleware - The middleware function to add to the chain.
	 * @returns This MiddlewareChain instance to allow for chaining.
	 */
	use(middleware: NodaMiddleware<T>): this;

	/**
	 * Executes the middleware chain with the given input value.
	 * @param input - The input value to pass through the middleware chain.
	 * @returns A Promise that resolves once all middleware functions have been executed.
	 */
	execute(input: T): Promise<void>;
}
