/**
  Copyright (C) 2009-2012. David Thevenin, ViniSketch SARL (c), and
  contributors. All rights reserved

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

import { isString, isArray } from './is';

/********************************************************************
                    String manipulation
*********************************************************************/

const __date_reg_exp = /\/Date\((-?\d+)\)\//;

/**
 * HTML-encodes a string and returns the encoded string.
 *
 *  @memberOf vs.util
 *
 * @param {String} str String The string
 */
function htmlEncode(str) {
  if (!isString(str)) return '';

  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 *  Strips all leading and trailing whitespace from a string.
 *
 *  @memberOf vs.util
 *
 * @param {String} str String The string
 */
function strip(str) {
  if (!isString(str)) return '';

  return str.replace(/^\s+/, '').replace(/\s+$/, '');
}

/**
 *  Converts a string separated by dashes into a camelCase equivalent
 *
 *  @memberOf vs.util
 *
 * @param {String} str String The string
 * @return {String} the result
 */
function camelize(str) {
  if (!isString(str)) return '';

  var parts = str.split('-'),
      len = parts.length;
  if (len === 1) {
    return parts[0];
  }

  var camelized = str.charAt(0) === '-' ? parts[0].charAt(0).toUpperCase() + parts[0].substring(1) : parts[0];

  for (var i = 1; i < len; i++) camelized += parts[i].charAt(0).toUpperCase() + parts[i].substring(1);

  return camelized;
}

/**
 *  Converts a string separated by dashes into a camelCase equivalent
 *
 *  @memberOf vs.util
 *
 * @param {String} str String The string
 * @return {String} the result
 */
function capitalize(str) {
  if (!isString(str)) return '';

  return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
}

/**
 *  Converts a camelized string into a series of words separated by an
 *  underscore (_).
 *
 *  @memberOf vs.util
 *
 * @param {String} str String The string
 * @return {String} the result
 */
function underscore(str) {
  if (!isString(str)) return '';

  return str.replace(/::/g, '/').replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z\d])([A-Z])/g, '$1_$2').replace(/-/g, '_').toLowerCase();
}

/**
 *  Parse a json string. <p/>
 *  This function use the JSON.parse function but it manage also
 *  Date parsing wich is not managed by the JSON.parse
 *
 *  @memberOf vs.util
 *  @ignore
 *
 * @param {String} str String The string
 * @return {Object} the result
 */
function parseJSON(json) {
  if (!json) return null;
  var temp = JSON.parse(json);

  if (!__date_reg_exp.test(json)) return temp;

  function manageDate(obj) {
    if (isString(obj)) {
      var result = __date_reg_exp.exec(obj);
      if (result && result[1]) // JSON Date -> Date generation
        {
          obj = new Date(parseInt(result[1]));
        }
    } else if (isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
        obj[i] = manageDate(obj[i]);
      }
    } else if (obj instanceof Date) {
      return obj;
    } else if (obj instanceof Object) {
      for (var key in obj) {
        obj[key] = manageDate(obj[key]);
      }
    }
    return obj;
  }
  return manageDate(temp);
};

/********************************************************************
                         export
*********************************************************************/

export {
// string
htmlEncode, strip, camelize, capitalize, underscore, parseJSON,

// other
__date_reg_exp };