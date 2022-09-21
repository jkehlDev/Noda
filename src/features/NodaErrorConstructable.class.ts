import { NodaErrorOptions, NodaError } from '../models';

export class NodaErrorConstructable implements NodaError {
	private static _DEFAULT_NAME = 'NodaError';
	private static _DEFAULT_CODE = 500;
	private static _MSG_SEPARATOR = '> Due to >';

	public message: string;
	public name: string;
	public cause?: NodaError;
	public code?: number;
	public stack?: string | undefined;

	constructor(error: unknown, options?: NodaErrorOptions) {
		this.message =
			typeof error === 'object'
				? (<{ message?: string }>error).message || JSON.stringify(error)
				: `${error}`;

		this.code =
			(<{ code?: number }>error).code ||
			options?.code ||
			NodaErrorConstructable._DEFAULT_CODE;

		this.name =
			(<{ name?: string }>error).name ||
			options?.name ||
			NodaErrorConstructable._DEFAULT_NAME;

		this.stack =
			(<{ stack?: string }>error).stack || options?.stack || undefined;

		this.cause =
			(<{ cause?: NodaError }>error).cause ||
			new NodaErrorConstructable(options?.cause) ||
			undefined;
	}

	toString(): string {
		return this.cause
			? `${this.message}${
				NodaErrorConstructable._MSG_SEPARATOR
			  }${this.cause.toString()}`
			: this.message;
	}
}
