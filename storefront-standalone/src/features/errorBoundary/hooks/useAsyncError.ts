import { useCallback, useState } from 'react';

/**
 * Taken from: https://medium.com/trabe/catching-asynchronous-errors-in-react-using-error-boundaries-5e8a5fd7b971
 * @description A hook that can be used to funnel async errors into the React error boundary
 * @returns A function that can be used to funnel async errors into the React error boundary
 */
export const useAsyncError = () => {
  const [, setError] = useState<Error>();
  const passErrorToErrorBoundary = useCallback(
    (e: Error | string) => {
      setError(() => {
        throw e instanceof Error ? e : new Error(e);
      });
    },
    [setError],
  );

  return { passErrorToErrorBoundary };
};
