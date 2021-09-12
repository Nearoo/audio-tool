import { useRef, useEffect } from 'react';

/**
 * Returns the previous value passed to that callback for every component update.
 * @param {*} value The current value
 * @param {*} firstValue Value to return the first time the component renders
 * @returns firstValue the first time, the previous "value" after that
 */
export const usePrevious = (value, firstValue) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current ?? firstValue;
}

/**
 * Works similar to useEffect, but calls the callback with two values every time the "dependency"
 * value changes: With the _previous_ value of the dependency, and the _current_ value. This can be used
 * to calculate the "delta value" between the last and current call..
 * 
 * The third value should be the "null" element of the value type of the dependency. This will be passed
 * as `previous` the first time the callback is called, and as `current` right before the component unmounts.
 * 
 * For example, if we have a number as a dependency `x`, we might use `0` as the "null" element, and write
 * ```
 * const x = ...;
 * usePreviousCurrentEffect((prev, curr) => callback(prev, curr), x, 0);
 * ```
 * Resulting in callbacks like
 * ```
 * callback(0, a) -> callback(a, b) -> callback(b, ...) -> ... -> callback(..., 0).
 * ```
 * @param {*} callback A callback `(previous, current) => {}`
 * @param {*} currentValue The current value
 * @param {*} nullValue The "null" element of the type of value passed
 */
export const usePreviousCurrentEffect = (callback, currentValue, nullValue) => {
  const previousValue = usePrevious(currentValue);
  // Delta calback
  useEffect(() => callback(previousValue ?? nullValue, currentValue), [currentValue, previousValue]);
  // FInishing callback
  useEffect(() => () => callback(currentValue, nullValue), []);
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
      if(classRef.current === undefined) // TODO: Trick doesn't work.
        classRef.current = new class_(...args);
      return classRef.current;
    }
}