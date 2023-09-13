import { isDate, isString } from './is';

function dateJSONReplacer(key: string, value: unknown): unknown {
  if (isDate(value)) {
    return `\\/Date${value.getTime()}\\/`;
  }
  return value;
}
/**
 *  Returns a JSON string.
 *
 * @param {Object} value The object to be serialized.
 * */
export function toJSON(value: unknown): string {
  return JSON.stringify(value, dateJSONReplacer);
}

const DATE_REG_EXP = /\/Date\((-?\d+)\)\//;

function dateJSONReviver(key: string, value: unknown): Date | unknown {
  if (isString(value)) {
    const result = DATE_REG_EXP.exec(value);
    if (result && result[1]) { // JSON Date -> Date generation
      return new Date(parseInt(result[1], 10));
    }
  }
  return value;
}

/**
 *  Parse a json string. <p/>
 *  This function use the JSON.parse function and manages also
 *  Date parsing which is not supported by the JSON.parse
 *
 * @param {String} str String The string
 * @return {Object} the result
 */
export function parseJSON<T>(json: string): T | undefined {
  if (!json) return undefined;
  return JSON.parse(json, dateJSONReviver);
}
