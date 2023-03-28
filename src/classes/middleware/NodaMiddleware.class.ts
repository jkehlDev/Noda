import type { INodaMiddlewareChain } from '../../interfaces';
import type { NodaMiddleware } from '../../types/middleware/NodaMiddleware.type';

/**
 * A generic middleware class that can be used to compose a series of middleware functions.
 * @remarks The input and output types for the middleware chain can be defined using generics.
 */
export default class NodaMiddlewareChain<T> implements INodaMiddlewareChain<T> {
	private readonly _middleware: NodaMiddleware<T>[] = [];

	/**
	 * Adds a new middleware function to the chain.
	 * @param middleware - The middleware function to add to the chain.
	 * @returns This MiddlewareChain instance to allow for chaining.
	 */
	public use(middleware: NodaMiddleware<T>): this {
		this._middleware.push(middleware);
		return this;
	}

	/**
	 * Executes the middleware chain with the given input value.
	 * @param input - The input value to pass through the middleware chain.
	 * @returns A Promise that resolves once all middleware functions have been executed.
	 */
	public async execute(input: T): Promise<void> {
		// Create a function that will recursively execute the middleware chain.
		const executeMiddleware = async (
			middlewareIndex: number,
			inputData: T
		): Promise<void> => {
			// If there are no more middleware functions, return without calling next.
			if (middlewareIndex >= this._middleware.length) {
				return;
			}

			// Get the next middleware function in the chain.
			const middleware = this._middleware[middlewareIndex];

			// Create a function that will be used as the `next` function for the current middleware function.
			const next = async (): Promise<void> => {
				// Call the next middleware function in the chain.
				await executeMiddleware(middlewareIndex + 1, inputData);
			};

			// Call the current middleware function with the input data and the `next` function.
			await middleware(inputData, next);
		};

		// Start executing the middleware chain with the given input data.
		await executeMiddleware(0, input);
	}
}
