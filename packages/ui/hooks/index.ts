import * as React from 'react';

export function useDebounce<Value = any>(value: Value, delay: number): Value {
   const [debouncedValue, setDebouncedValue] = React.useState(value);

   React.useEffect(() => {
      const handler = setTimeout(() => {
         setDebouncedValue(value);
      }, delay);
      return () => {
         clearTimeout(handler);
      };
   }, [value, delay]);

   return debouncedValue;
}

export function useDebouncedCallback<Args extends any[]>(
   callback: (...args: Args) => void,
   wait: number
) {
   const savedCallbackRef = React.useRef(callback);
   const argsRef = React.useRef<Args>();
   const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

   function cleanup() {
      if (timeoutRef.current) {
         clearTimeout(timeoutRef.current);
      }
   }

   React.useEffect(() => {
      savedCallbackRef.current = callback;
   }, [callback]);

   React.useEffect(() => cleanup, []);

   return function debouncedCallback(...args: Args) {
      argsRef.current = args;

      function execute() {
         if (argsRef.current) {
            savedCallbackRef.current(...argsRef.current);
         }
      }

      cleanup();

      timeoutRef.current = setTimeout(execute, wait);
   };
}

export function usePrevious<T>(value: T): T | undefined {
   const ref = React.useRef<T>();

   React.useEffect(() => {
      ref.current = value;
   }, [value]);

   return ref.current;
}

export const useIsomorphicLayoutEffect =
   typeof document !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export function useIsMounted() {
   const [isMounted, setIsMounted] = React.useState(false);

   React.useEffect(() => {
      setIsMounted(true);
   }, []);

   return isMounted;
}

interface UsePreloadImage {
   preload(url: string): Promise<void>;
   isLoaded: boolean;
   isError: boolean;
   error: any;
}

export function usePreloadImage(): UsePreloadImage {
   const [state, setState] = React.useState<{
      status: 'idle' | 'loading' | 'loaded' | 'error';
      error: any;
   }>({
      status: 'idle',
      error: null,
   });

   const preload = React.useCallback(async (url: string) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
         setState({
            status: 'loaded',
            error: null,
         });
      };
      img.onerror = (err) => {
         setState({
            status: 'error',
            error: err,
         });
      };
   }, []);

   return {
      preload,
      isError: state.status === 'error',
      isLoaded: state.status === 'loaded',
      error: state.error,
   };
}