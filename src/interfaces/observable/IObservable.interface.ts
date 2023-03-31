/**
 * An observer that receives notifications from an Observable.
 * @interface
 * @template T
 */
export interface INodaObserver<T> {
	/**
	 * Receives the next value from the Observable.
	 * @param {T} value - The next value.
	 */
	next(value: T): void;
	/**
	 * Receives an error from the Observable.
	 * @param {Error} error - The error.
	 */
	error(error: Error): void;
	/**
	 * Receives a completion notification from the Observable.
	 */
	complete(): void;
}

export interface INodaObservable<T> {
	subscribe(observer: INodaObserver<T>): void;
	unsubscribe(observer: INodaObserver<T>): void;
	next(value: T): void;
	error(error: Error): void;
	complete(): void;
}
