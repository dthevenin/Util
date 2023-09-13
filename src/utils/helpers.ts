import { NotNullableParameter } from './types';
import { isArray, isFunction, isObject, isString } from './is';

const { toString } = Object.prototype;

/**
 * @private
 */
export function clone<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (isObject(obj) && 'clone' in obj && isFunction(obj.clone)) {
    return obj.clone();
  }

  return structuredClone(obj);
}

/**
 * Free a ViniSketch object
 *
 * @param {Object} obj the object to free
 */
export function free(obj: any): void {
  if (!obj) { return; }
  if (obj._free) { obj._free (); }
  if (obj.destructor) { obj.destructor (); }
}

export function isEmpty<T extends NotNullableParameter>(value: T | null | undefined): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  if (isString(value)) {
    return !value || !value.trim();
  }
  if (isArray(value)) {
    return value.length === 0;
  }
  if (value instanceof Set || value instanceof Map) {
    return value.size === 0;
  }
  return Object.entries(value).length === 0;
}

export function isNotEmpty<T extends NotNullableParameter>(value: T | null | undefined): boolean {
  return !isEmpty(value);
}
