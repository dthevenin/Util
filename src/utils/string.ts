import {isString, isArray, isDate, isObject} from './is';

/********************************************************************
 String manipulation
 *********************************************************************/

const __date_reg_exp = /\/Date\((-?\d+)\)\//;

/**
 * HTML-encodes a string and returns the encoded string.
 *
 * @param {String} str String The string
 */
export const htmlEncode = (str: string): string => str.replace (/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 *  Strips all leading and trailing whitespace from a string.
 *
 * @param {String} str String The string
 */
export const strip = (str: string): string => str.replace(/^\s+/, '').replace(/\s+$/, '');

/**
 *  Converts a string separated by dashes into a camelCase equivalent
 *
 * @param {String} str String The string
 * @return {String} the result
 */
export function camelize(str: string): string {
  const parts = str.split('-');
  const len = parts.length;

  if (len === 1) {
    return parts[0];
  }

  let camelized = str.charAt(0) === '-'
    ? parts[0].charAt(0).toUpperCase() + parts[0].substring(1)
    : parts[0];

  for (let i = 1; i < len; i += 1) {
    camelized += parts[i].charAt(0).toUpperCase() + parts[i].substring(1);
  }

  return camelized;
}

/**
 *  Converts a string separated by dashes into a camelCase equivalent
 *
 * @param {String} str String The string
 * @return {String} the result
 */
export const capitalize =(str: string): string => str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();

/**
 *  Converts a caramelized string into a series of words separated by an
 *  underscore (_).
 *
 * @param {String} str String The string
 * @return {String} the result
 */
export const underscore = (str: string): string => str.replace (/::/g, '/')
  .replace (/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
  .replace (/([a-z\d])([A-Z])/g, '$1_$2')
  .replace (/-/g, '_')
  .toLowerCase ();
