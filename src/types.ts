/**
 * Type definitions for the Fly Chaing chat application.
 */

export interface Env {
	/**
	 * Binding for the Workers AI API.
	 */
	AI: Ai;

	/**
	 * Binding for static assets.
	 */
	ASSETS: { fetch: (request: Request) => Promise<Response> };
}

/**
 * Represents a chat message.
 */
export interface ChatMessage {
	role: "system" | "user" | "assistant";
	content: string;
}
export interface Env {
  AI: any;
  ASSETS: any;
  ACCESS_TOKEN: string;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}


