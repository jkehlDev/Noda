import type { INodaError } from '../../interfaces';
import type { NodaErrorOptions } from '../../types';

/**
 * Class representing a NodaError.
 * @implements {INodaError}
 */
export class NodaError implements INodaError {
	/**
	 * The default name for NodaError.
	 * @private
	 * @static
	 */
	private static _DEFAULT_NAME = 'NodaError';

	/**
	 * The default error code for NodaError.
	 * @private
	 * @static
	 */
	private static _DEFAULT_CODE = 500;

	/**
	 * The separator used for concatenating error messages.
	 * @private
	 * @static
	 */
	private static _MSG_SEPARATOR = '> Due to >';

	/**
	 * The error code for the NodaError.
	 * @public
	 */
	public code: number;

	/**
	 * The name of the NodaError.
	 * @public
	 */
	public name: string;

	/**
	 * The error message for the NodaError.
	 * @public
	 */
	public message: string;

	/**
	 * The cause of the NodaError, if any.
	 * @public
	 */
	public cause?: INodaError;

	/**
	 * The stack trace for the NodaError, if any.
	 * @public
	 */
	public stack?: string | undefined;

	/**
	 * The original error code for the NodaError.
	 * @public
	 */
	public originalCode: number;

	/**
	 * The original error name for the NodaError.
	 * @public
	 */
	public originalName: string;

	/**
	 * Creates a new NodaError.
	 * @param {unknown} error - The error object or message.
	 * @param {NodaErrorOptions} [options] - The options for the error.
	 */
	constructor(error: unknown, options?: NodaErrorOptions) {
		if (typeof error !== 'object') {
			this.message = Object(error).toString();
			this.code = NodaError._DEFAULT_CODE;
			this.name = NodaError._DEFAULT_NAME;
		} else {
			const errorTemplated = error as INodaError;
			this.message = errorTemplated?.message ?? 'Undefined error';
			this.cause =
				(errorTemplated?.cause && new NodaError(errorTemplated.cause)) ||
				(options?.cause ? new NodaError(options.cause) : undefined);

			this.code =
				errorTemplated?.code ??
				(options?.code || undefined) ??
				NodaError._DEFAULT_CODE;

			this.name =
				errorTemplated?.name ??
				(options?.name || undefined) ??
				NodaError._DEFAULT_NAME;
			this.stack = errorTemplated?.stack ?? (options?.stack || undefined);
		}
		this.originalCode = this.cause?.originalCode || this.code;
		this.originalName = this.cause?.originalName || this.name;
	}

	/**
	 * Returns a string representation of the NodaError.
	 * @returns {string} - The string representation of the error.
	 */
	toString(): string {
		return this.cause
			? `${this.message}${NodaError._MSG_SEPARATOR}${this.cause}`
			: this.message;
	}
}
