import { useCallback } from 'react';

/**
 * useGetElementProperty function
 * @param {*} elementRef 
 * @returns 
 */
export const useGetElementProperty = (elementRef) => {
      const getElementProperty = useCallback(
            (targetProperty) => {
                  const clientRect = elementRef.current?.getBoundingClientRect();
                  if (clientRect) {
                        return clientRect[targetProperty];
                  }
                  return 0;
            },
            [elementRef],
      );

      return {
            getElementProperty,
      };
};