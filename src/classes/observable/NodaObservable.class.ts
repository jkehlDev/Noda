import { INodaObservable, INodaObserver } from '../../interfaces';

/**
 * Represents a source of values that can be observed.
 * @class
 * @template T
 */
export class NodaObservable<T> implements INodaObservable<T> {
	/** @private */
	private observers: INodaObserver<T>[] = [];

	/**
	 * Subscribes an observer to the Observable.
	 * @param {INodaObserver<T>} observer - The observer to subscribe.
	 */
	subscribe(observer: INodaObserver<T>): void {
		this.observers.push(observer);
	}

	/**
	 * Unsubscribes an observer from the Observable.
	 * @param {INodaObserver<T>} observer - The observer to unsubscribe.
	 */
	unsubscribe(observer: INodaObserver<T>): void {
		const index = this.observers.indexOf(observer);
		if (index !== -1) {
			this.observers.splice(index, 1);
		}
	}

	/**
	 * Sends the next value to all subscribed observers.
	 * @param {T} value - The next value.
	 */
	next(value: T): void {
		for (const observer of this.observers) {
			observer.next(value);
		}
	}

	/**
	 * Sends an error to all subscribed observers.
	 * @param {Error} error - The error.
	 */
	error(error: Error): void {
		for (const observer of this.observers) {
			observer.error(error);
		}
	}

	/**
	 * Sends a completion notification to all subscribed observers.
	 */
	complete(): void {
		for (const observer of this.observers) {
			observer.complete();
		}
	}
}
