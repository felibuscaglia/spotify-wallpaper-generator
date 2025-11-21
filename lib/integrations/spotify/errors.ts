/**
 * Custom error classes for Spotify API client
 */

export class SpotifyClientError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'SpotifyClientError';
    Object.setPrototypeOf(this, SpotifyClientError.prototype);
  }
}

export class SpotifyAuthenticationError extends SpotifyClientError {
  constructor(message: string = 'Authentication failed', originalError?: unknown) {
    super(message, 401, originalError);
    this.name = 'SpotifyAuthenticationError';
    Object.setPrototypeOf(this, SpotifyAuthenticationError.prototype);
  }
}

export class SpotifyRateLimitError extends SpotifyClientError {
  constructor(
    message: string = 'Rate limit exceeded',
    public retryAfter?: number,
    originalError?: unknown
  ) {
    super(message, 429, originalError);
    this.name = 'SpotifyRateLimitError';
    Object.setPrototypeOf(this, SpotifyRateLimitError.prototype);
  }
}

export class SpotifyNotFoundError extends SpotifyClientError {
  constructor(message: string = 'Resource not found', originalError?: unknown) {
    super(message, 404, originalError);
    this.name = 'SpotifyNotFoundError';
    Object.setPrototypeOf(this, SpotifyNotFoundError.prototype);
  }
}

export class SpotifyForbiddenError extends SpotifyClientError {
  constructor(message: string = 'Access forbidden', originalError?: unknown) {
    super(message, 403, originalError);
    this.name = 'SpotifyForbiddenError';
    Object.setPrototypeOf(this, SpotifyForbiddenError.prototype);
  }
}


