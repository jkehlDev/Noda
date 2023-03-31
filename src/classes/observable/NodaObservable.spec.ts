import { NodaObservable } from './NodaObservable.class';

describe('Observable', () => {
	let observable: NodaObservable<number>;

	beforeEach(() => {
		observable = new NodaObservable();
	});

	describe('subscribe', () => {
		it('should add observer to observers list', () => {
			const observer = {
				next: jest.fn(),
				error: jest.fn(),
				complete: jest.fn()
			};
			observable.subscribe(observer);
			expect(observable['observers']).toContain(observer);
		});
	});

	describe('unsubscribe', () => {
		it('should remove observer from observers list', () => {
			const observer = {
				next: jest.fn(),
				error: jest.fn(),
				complete: jest.fn()
			};
			observable.subscribe(observer);
			observable.unsubscribe(observer);
			expect(observable['observers']).not.toContain(observer);
		});
	});

	describe('next', () => {
		it('should call the next method of all observers', () => {
			const observer1 = {
				next: jest.fn(),
				error: jest.fn(),
				complete: jest.fn()
			};
			const observer2 = {
				next: jest.fn(),
				error: jest.fn(),
				complete: jest.fn()
			};
			observable.subscribe(observer1);
			observable.subscribe(observer2);
			observable.next(42);
			expect(observer1.next).toHaveBeenCalledWith(42);
			expect(observer2.next).toHaveBeenCalledWith(42);
		});
	});

	describe('error', () => {
		it('should call the error method of all observers', () => {
			const observer1 = {
				next: jest.fn(),
				error: jest.fn(),
				complete: jest.fn()
			};
			const observer2 = {
				next: jest.fn(),
				error: jest.fn(),
				complete: jest.fn()
			};
			const error = new Error('Test error');
			observable.subscribe(observer1);
			observable.subscribe(observer2);
			observable.error(error);
			expect(observer1.error).toHaveBeenCalledWith(error);
			expect(observer2.error).toHaveBeenCalledWith(error);
		});
	});

	describe('complete', () => {
		it('should call the complete method of all observers', () => {
			const observer1 = {
				next: jest.fn(),
				error: jest.fn(),
				complete: jest.fn()
			};
			const observer2 = {
				next: jest.fn(),
				error: jest.fn(),
				complete: jest.fn()
			};
			observable.subscribe(observer1);
			observable.subscribe(observer2);
			observable.complete();
			expect(observer1.complete).toHaveBeenCalled();
			expect(observer2.complete).toHaveBeenCalled();
		});
	});
});
