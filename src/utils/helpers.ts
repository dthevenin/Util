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

  const value: unknown = obj;
  if (isObject(value) && 'clone' in value && isFunction(value.clone)) {
    return value.clone() as T;
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

export function defined<T>(value: T | null | undefined, msg?: string): T {
  if (value === null || value === undefined) {
    throw new Error(msg || 'Value is not defined');
  }
  return value;
}
