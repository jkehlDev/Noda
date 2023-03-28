import { NodaError } from './NodaError.class';

describe('NodaError', () => {
	describe('constructor', () => {
		it('should create a new NodaError with default values if passed a non-object', () => {
			const error = new NodaError('Test error');
			expect(error.message).toEqual('Test error');
			expect(error.code).toEqual(500);
			expect(error.name).toEqual('NodaError');
		});

		it('should create a new NodaError with custom values if passed an object', () => {
			const error = new NodaError({
				message: 'Test error',
				code: 404,
				name: 'CustomError'
			});

			expect(error.message).toEqual('Test error');
			expect(error.code).toEqual(404);
			expect(error.name).toEqual('CustomError');
		});

		it('should create a new NodaError with cause if passed an object with cause property', () => {
			const error = new NodaError({
				message: 'Test error',
				cause: new NodaError('Cause error')
			});

			expect(error.cause).toBeInstanceOf(NodaError);
			expect(error.cause?.message).toEqual('Cause error');
		});
	});

	describe('toString', () => {
		it('should return the message if there is no cause', () => {
			const error = new NodaError('Test error');
			expect(error.toString()).toEqual('Test error');
		});

		it('should return the message concatenated with cause if there is a cause', () => {
			const error = new NodaError({
				message: 'Test error',
				cause: new NodaError('Cause error')
			});

			expect(error.toString()).toEqual('Test error> Due to >Cause error');
		});
	});
});
