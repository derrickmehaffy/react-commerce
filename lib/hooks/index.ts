import * as React from 'react';

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

      // start waiting again
      timeoutRef.current = setTimeout(execute, wait);
   };
}
