export const MOCK_API_DELAY_MS = 400;

export const delay = (ms = MOCK_API_DELAY_MS) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}
