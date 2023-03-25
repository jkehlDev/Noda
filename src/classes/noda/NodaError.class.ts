import { INodaError } from '../../interfaces';
import { NodaErrorOptions } from '../../types';

export class NodaError implements INodaError {
	private static _DEFAULT_NAME = 'NodaError';
	private static _DEFAULT_CODE = 500;
	private static _MSG_SEPARATOR = '> Due to >';

	public code: number;
	public name: string;
	public message: string;

	public cause?: INodaError;
	public stack?: string | undefined;

	public originalCode: number;
	public originalName: string;

	/**
	 *
	 * @param error
	 * @param options
	 */
	constructor(error: unknown, options?: NodaErrorOptions) {
		this.message =
			typeof error === 'object'
				? (<{ message?: string }>error)?.message || JSON.stringify(error)
				: `${error}`;
		this.cause =
			(<{ cause?: INodaError }>error)?.cause ||
			(options?.cause ? new NodaError(options.cause) : undefined);

		this.code =
			(<{ code?: number }>error)?.code ||
			options?.code ||
			NodaError._DEFAULT_CODE;

		this.name =
			(<{ name?: string }>error)?.name ||
			options?.name ||
			NodaError._DEFAULT_NAME;

		this.stack =
			(<{ stack?: string }>error).stack || options?.stack || undefined;

		this.originalCode = this.cause?.code || this.code;
		this.originalName = this.cause?.name || this.name;
	}

	/**
	 *
	 * @returns
	 */
	toString(): string {
		return this.cause
			? `${this.message}${NodaError._MSG_SEPARATOR}${this.cause.toString()}`
			: this.message;
	}
}
