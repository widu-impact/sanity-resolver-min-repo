import { createContext } from 'react';

import { type ErrorFallbackProps } from '../model/ErrorBoundaryModel';

export const ErrorBoundaryContext = createContext<ErrorFallbackProps>({
  error: null,
  onReset: () => undefined,
});

type ErrorBoundaryProviderProps = {
  contextValue: {
    error: Error | null;
    onReset: () => void;
  };
};

export function ErrorBoundaryProvider({
  children,
  contextValue,
}: React.PropsWithChildren<ErrorBoundaryProviderProps>) {
  return (
    <ErrorBoundaryContext.Provider value={contextValue}>{children}</ErrorBoundaryContext.Provider>
  );
}
