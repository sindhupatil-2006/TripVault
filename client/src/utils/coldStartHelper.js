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
 * Executes an async API call with a single automatic retry if a cold-start transient error occurs.
 */
export const executeWithColdStartRetry = async (requestFn, onRetryNotice) => {
  try {
    return await requestFn();
  } catch (error) {
    if (isColdStartError(error)) {
      if (onRetryNotice) {
        onRetryNotice('Server is waking up from sleep. Retrying connection automatically...');
      }
      // Wait 3 seconds for container boot before retrying once
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return await requestFn();
    }
    throw error;
  }
};
