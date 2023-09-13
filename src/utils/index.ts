export * from './is';
export * from './string';
export * from './dimension';
export * from './array';
export * from './types';
export * from './json'
export * from './helpers';
export * from './mixins';
export * from './await_ready';

import { DIContainer } from './di_container';

export { injectionToken } from './di_container';

export const container = new DIContainer();

export const isPowerOfTwo = (x: number): boolean => (x !== 0) && ((x & (x - 1)) === 0);
