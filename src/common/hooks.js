import { useRef, useEffect } from 'react';

export const usePrevious = (value, firstValue) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current ?? firstValue;
}


/** 
 * Works like useEffect but passes the previous value to the callback.
 * The first time the callback is called, as well as before the component unmounts,
 * the first value is used.
 */
export const useEffectWithPrevious = (callback, currentValue, firstValue) => {
    const previousValue = usePrevious(currentValue, firstValue);
    useEffect(() => callback(previousValue), [currentValue]);
    useEffect(() => () => callback(firstValue), []);
}