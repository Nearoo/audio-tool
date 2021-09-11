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

/**
 * Convencience hook to instanciate classes inside functional react components.
 * 
 * Instead of 
 * ```
 * const fb = new FooBar(x, y, z);
 * ```
 * Simply write
 * ```
 * const fb = useNew(FooBar)(x, y, z);
 * ```
 * 
 */
export const useNew = (class_) => {
    const classRef = useRef();
    return (...args) => {
      if(classRef.current === undefined)
        classRef.current = new class_(...args);
      return classRef.current;
    }
}