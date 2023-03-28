/**
 * Represents an error in Noda framework
 */
export interface INodaError extends Error {
	/**
	 * Error code
	 */
	code: number;
	/**
	 * Error name
	 */
	name: string;
	/**
	 * Error message
	 */
	message: string;
	/**
	 * The cause of the error
	 */
	cause?: INodaError;
	/**
	 * Error stack trace
	 */
	stack?: string | undefined;
	/**
	 * The original error code
	 */
	originalCode: number;
	/**
	 * The original error name
	 */
	originalName: string;
}
