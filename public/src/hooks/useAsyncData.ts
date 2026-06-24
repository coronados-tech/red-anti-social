import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Ocurrió un error';
}

export interface UseAsyncDataOptions<T> {
  /** Si es false, no dispara el fetch automático. Default: true */
  enabled?: boolean;
  /** Valor inicial de `data` mientras no hay respuesta */
  initialData?: T | null;
  /** Callback opcional al recibir datos con éxito */
  onSuccess?: (data: T) => void;
}

export interface UseAsyncDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string;
  /** Vuelve a ejecutar el fetcher manualmente */
  reload: () => Promise<void>;
  setData: Dispatch<SetStateAction<T | null>>;
  setError: Dispatch<SetStateAction<string>>;
}

export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: readonly unknown[],
  options: UseAsyncDataOptions<T> = {},
): UseAsyncDataResult<T> {
  const { enabled = true, initialData = null, onSuccess } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState('');

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const result = await fetcherRef.current();
      setData(result);
      onSuccessRef.current?.(result);
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function run() {
      setLoading(true);
      setError('');

      try {
        const result = await fetcherRef.current();
        if (!cancelled) {
          setData(result);
          onSuccessRef.current?.(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(toErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [enabled, ...deps]);

  return { data, loading, error, reload, setData, setError };
}
