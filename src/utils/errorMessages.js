// Internal sentinel thrown on 401s; never shown to the user directly
export const UNAUTHORIZED = 'unauthorized';

export const SESSION_EXPIRED_MESSAGE =
  'Your session has expired. Please log in again.';

export const NETWORK_ERROR_MESSAGE =
  'We could not reach the server. Check your connection and try again.';

/**
 * Logs the technical detail (status codes, server messages, stack traces)
 * to the console in development only. Production users see nothing here.
 */
export function logDevError(context, error) {
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error);
  }
}

/**
 * Maps an internal error to a message safe to render in the UI. Anything we
 * didn't explicitly classify falls back to the caller's generic message so
 * raw fetch/server text never leaks through.
 */
export function toUserMessage(error, fallback) {
  if (error?.message === UNAUTHORIZED) {
    return SESSION_EXPIRED_MESSAGE;
  }

  // fetch() rejects with a TypeError when the network itself fails
  if (error instanceof TypeError) {
    return NETWORK_ERROR_MESSAGE;
  }

  return fallback;
}
