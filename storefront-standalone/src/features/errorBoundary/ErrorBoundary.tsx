'use client';

import { Component, type ErrorInfo } from 'react';

import { ErrorBoundaryFallback } from './components/ErrorBoundaryFallback';
import { ErrorBoundaryProvider } from './context/ErrorBoundaryProvider';
import { type ErrorBoundaryProps, type ErrorBoundaryState } from './model/ErrorBoundaryModel';

const initialState = { error: null };

/**
 * |---------------------------------------------------------------------------------------------|
 * | IMPORTANT: THIS DOES NOT WORK WITH SSR (Server Side Rendering) and ASYNC FUNCTIONS DIRECTLY |
 * | FOR ASYNC FUNCTIONS USE useAsyncError HOOK IN A TRY CATCH                                   |
 * |---------------------------------------------------------------------------------------------|
 * How to use:
 * Wrap a scope in error boundary to catch errors
 * @example
 * <ErrorBoundary onError={onError} onReset={onReset} fallback={Fallback}>
 *    <WithBugs />
 * </ErrorBoundary>
 *
 * onError = Evoke function on error
 * onReset = Evoke retry or try to fix function when useError onReset is executed
 * fallback = Supply fallback component, defaults to <ErrorBoundaryFallback />
 *
 * Error is available in fallback componenet with useError hook
 *
 * @example
 * const { error, onReset } = useError();
 *
 * <div>Sorry an error occurred {error.message} try again?
 * <button onClick={onReset}>
 *     Try again
 * </button>
 *
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.onReset = this.onReset.bind(this);
    this.state = initialState;
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // TODO: Log error to error tracking service like AppInsights
    // eslint-disable-next-line react/destructuring-assignment
    this.props.onError?.(error, info);
    console.error(`%c${error.message}`, 'color: #eed202');
  }

  onReset(): void {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.onReset?.();
    this.setState(initialState);
  }

  render(): JSX.Element {
    const { error } = this.state;
    const { children } = this.props;

    if (error !== null) {
      const { fallback: Fallback = <ErrorBoundaryFallback /> } = this.props;
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const contextValue = { error, onReset: this.onReset };

      return (
        <ErrorBoundaryProvider contextValue={contextValue}>
          {typeof Fallback === 'function' ? <Fallback {...contextValue} /> : Fallback}
        </ErrorBoundaryProvider>
      );
    }

    return <>{children}</>;
  }
}
