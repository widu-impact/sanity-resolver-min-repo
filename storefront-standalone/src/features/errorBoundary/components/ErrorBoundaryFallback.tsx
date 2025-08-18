import styles from './ErrorBoundaryFallback.module.css';

type Props = {
  description?: string;
};

export function ErrorBoundaryFallback({ description }: Props) {
  // use "useError" hook to get error and onReset function, if you want to use the actual error
  return (
    <div className={styles.container}>
      <p className={styles.message}>{description ?? 'Content unavailable because of error'}</p>
    </div>
  );
}
