import { NodaMiddleware } from '../../types/middleware/NodaMiddleware.type';
import { NodaMiddlewareChain } from './NodaMiddleware.class';

describe('NodaMiddlewareChain', () => {
	let middlewareChain: NodaMiddlewareChain<string>;

	beforeEach(() => {
		middlewareChain = new NodaMiddlewareChain();
	});

	describe('use', () => {
		it('should add middleware functions to the chain', () => {
			const middleware1: NodaMiddleware<string> = jest
				.fn()
				.mockImplementation(async (input, next) => {
					next();
				});
			const middleware2: NodaMiddleware<string> = jest
				.fn()
				.mockImplementation(async (input, next) => {
					next();
				});
			middlewareChain.use(middleware1).use(middleware2);
			expect(middlewareChain['_middleware']).toEqual([
				middleware1,
				middleware2
			]);
		});

		it('should return the middleware chain instance to allow for chaining', () => {
			const result = middlewareChain.use(jest.fn());
			expect(result).toBe(middlewareChain);
		});
	});

	describe('execute', () => {
		it('should execute all middleware functions in the chain', async () => {
			const middleware1: NodaMiddleware<string> = jest
				.fn()
				.mockImplementation(async (input, next) => {
					next();
				});
			const middleware2: NodaMiddleware<string> = jest
				.fn()
				.mockImplementation(async (input, next) => {
					next();
				});
			middlewareChain.use(middleware1).use(middleware2);
			await middlewareChain.execute('test');
			expect(middleware1).toHaveBeenCalledWith('test', expect.anything());
			expect(middleware2).toHaveBeenCalledWith('test', expect.anything());
		});

		it('should stop executing middleware functions if next is not called', async () => {
			const middleware1: NodaMiddleware<string> = jest
				.fn()
				.mockImplementation(async (input, next) => {
					return;
				});
			const middleware2: NodaMiddleware<string> = jest
				.fn()
				.mockImplementation(async (input, next) => {
					next();
				});
			middlewareChain.use(middleware1).use(middleware2);
			await middlewareChain.execute('test');
			expect(middleware1).toHaveBeenCalledWith('test', expect.anything());
			expect(middleware2).not.toHaveBeenCalled();
		});
	});
});
