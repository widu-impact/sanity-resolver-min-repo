import { type ComponentType, type FC } from 'react';

import { ErrorBoundary } from './ErrorBoundary';

/**
 * |---------------------------------------------------------------------------------------------|
 * | IMPORTANT: THIS DOES NOT WORK WITH SSR (Server Side Rendering) and ASYNC FUNCTIONS DIRECTLY |
 * | FOR ASYNC FUNCTIONS USE useAsyncError HOOK IN A TRY CATCH                                   |
 * |---------------------------------------------------------------------------------------------|
 * HOC to wrap the export, provide a optional fallback component
 * @example
 * export default withErrorBoundary(MyComponent, <ErrorBoundaryFallback description="This content is currently not available"/>)
 */
export function withErrorBoundary<Props = Record<string, unknown>>(
  WrappedComponent: ComponentType,
  FallBack?: FC<unknown> | JSX.Element,
): FC<Props> {
  function WithErrorBoundry() {
    return (
      <ErrorBoundary fallback={FallBack}>
        <WrappedComponent />
      </ErrorBoundary>
    );
  }

  return WithErrorBoundry;
}
