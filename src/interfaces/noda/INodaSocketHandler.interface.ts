import type { NodeSocket } from '../../types';

/**
 * Interface for a socket handler that handles socket connections and messages.
 */
export interface INodaSocketHandler {
	/**
	 * Handles the specified socket connection.
	 * @param socket The socket to handle.
	 */
	handle(socket: NodeSocket): void;
}
