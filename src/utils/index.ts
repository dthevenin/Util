export * from './is';
export * from './matrix';
export * from './string';
export * from './point';
export * from './dimension';
export * from './array';
export * from './file';
export * from './types';
export * from './di_container';

export const isPowerOfTwo = (x: number): boolean => (x !== 0) && ((x & (x - 1)) === 0);
