import { type ErrorInfo, type FC, type ReactNode } from 'react';

export type ErrorBoundaryState = {
  error: Error | null;
};

export type ErrorFallbackProps = {
  error: Error | null;
  onReset: () => void;
};

export type ErrorBoundaryProps = {
  children?: ReactNode;
  fallback?: FC<ErrorFallbackProps> | JSX.Element;
  onError?: (error: Error, info: ErrorInfo) => void;
  onReset?: () => void;
};
