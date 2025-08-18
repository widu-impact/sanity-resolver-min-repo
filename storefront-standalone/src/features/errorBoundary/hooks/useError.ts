import { useContext } from 'react';

import { ErrorBoundaryContext } from '../context/ErrorBoundaryProvider';

export const useError = () => {
  return useContext(ErrorBoundaryContext);
};
