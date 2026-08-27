/**
 * Determines whether an Axios error is a transient cold-start or network availability error.
 * 4xx status codes (400, 401, 403, 404, etc.) are application errors and MUST NOT be retried.
 */
export const isColdStartError = (error) => {
  if (!error) return false;
  const status = error.response?.status;

  // 4xx status codes are explicit business validation responses and must never be retried
  if (status && status >= 400 && status < 500) {
    return false;
  }

  const is503 = status === 503 || error.response?.headers?.['x-render-routing'] === 'hibernate-wake-error';
  const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
  const isNetworkError = error.code === 'ERR_NETWORK' || error.message === 'Network Error';

  return is503 || isTimeout || isNetworkError;
};

/**
 * Executes an async API call with automatic retries if a cold-start transient error occurs.
 * Max retries: 15 attempts x 5 seconds = 75s total coverage for Render 50s+ cold starts.
 */
export const executeWithColdStartRetry = async (requestFn, onRetryNotice, maxRetries = 15) => {
  let attempt = 0;
  const intervalMs = 5000;

  while (attempt <= maxRetries) {
    try {
      return await requestFn(); // Exit immediately once server responds
    } catch (error) {
      if (isColdStartError(error) && attempt < maxRetries) {
        attempt += 1;
        if (onRetryNotice) {
          onRetryNotice(
            `Waking up the server — this can take up to a minute on first load... (attempt ${attempt}/${maxRetries})`
          );
        }
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
      } else {
        throw error;
      }
    }
  }
};
