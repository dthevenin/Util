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
  var parts = str.split ('-'), len = parts.length;
  if (len === 1) { return parts [0]; }

  var camelized = str.charAt (0) === '-'
    ? parts [0].charAt (0).toUpperCase () + parts [0].substring (1)
    : parts [0];

  for (var i = 1; i < len; i++)
    camelized += parts[i].charAt (0).toUpperCase() + parts[i].substring (1);

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

/**
 *  Parse a json string. <p/>
 *  This function use the JSON.parse function and manages also
 *  Date parsing which is not supported by the JSON.parse
 *  @ignore
 *
 * @param {String} json String The string
 * @return {Object} the result
 */
export function parseJSON (json: string): any {
  if (!json) return null;
  var temp = JSON.parse (json);

  if (!__date_reg_exp.test (json)) return temp;

  function manageDate (obj: unknown) {
    if (isString (obj)) {
      const result = __date_reg_exp.exec (obj);
      if (result && result [1]) { // JSON Date -> Date generation
        obj = new Date (parseInt (result [1]));
      }
    }
    else if (isArray (obj)) {
      for (var i = 0; i < obj.length; i++) { obj [i] = manageDate (obj [i]); }
    }
    else if (isDate(obj)) { return obj; }
    else if (isObject(obj)) {
      for (var key in obj) {
        obj [key] = manageDate (obj [key]); }
    }
    return obj;
  }
  return manageDate (temp);
}
