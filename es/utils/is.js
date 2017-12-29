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

import { STRING_CLASS, ARRAY_CLASS } from './helpers';

/********************************************************************
                    Testing methods
*********************************************************************/

/**
 * @private
 **/
var _toString = Object.prototype.toString;

/**
 *  Returns `true` if `object` is a DOM node of type 1; `false` otherwise.
 *
 *  @example
 *
 *  vs.util.isElement(new Element('div'));
 *  //-> true
 *
 *  vs.util.isElement(document.createElement('div'));
 *  //-> true
 *
 *  vs.util.isElement(document.createTextNode('foo'));
 *  //-> false
 *
 *  @memberOf vs.util
 *
 * @param {Object} object The object to test.
 **/
function isElement(object) {
  return !!(object && object.nodeType === 1);
};

/**
 *  Returns `true` if `object` is an [[Array]]; `false` otherwise.
 *
 *  @example
 *
 *  vs.util.isArray([]);
 *  //-> true
 *
 *  vs.util.isArray({ });
 *  //-> false
 *
 *  @memberOf vs.util
 *
 * @param {Object} object The object to test.
 **/
var isArray = Array.isArray || function (object) {
  return _toString.call(object) === ARRAY_CLASS;
};

/**
 *  Returns `true` if `object` is an Function; `false` otherwise.
 *
 *  @memberOf vs.util
 *
 * @param {Object} object The object to test.
 **/
function isFunction(object) {
  return typeof object === "function";
};

/**
 *  Returns `true` if `object` is an String; `false` otherwise.
 *
 *  @example
 *
 *  vs.util.isString ("qwe");
 *  //-> true
 *
 *  vs.util.isString (123);
 *  //-> false
 *
 *  @memberOf vs.util
 *
 * @param {Object} object The object to test.
 **/
function isString(object) {
  return _toString.call(object) === STRING_CLASS;
};

/**
 *  Returns `true` if `object` is an Number; `false` otherwise.
 *
 *  @example
 *
 *  vs.util.isNumber (123);
 *  //-> true
 *
 *  vs.util.isNumber (1.23);
 *  //-> true
 *
 *  vs.util.isNumber ("123");
 *  //-> false
 *
 *  @memberOf vs.util
 *
 * @param {Object} object The object to test.
 **/
function isNumber(object) {
  return typeof object === 'number' && isFinite(object) || object instanceof Number;
};

/**
 *  Returns `true` if `object` is an "pure" Object; `false` otherwise.
 *
 *  @example
 *
 *  vs.util.isObject (123);
 *  //-> false
 *
 *  vs.util.isObject ([]);
 *  //-> false
 *
 *  vs.util.isObject ({});
 *  //-> true
 *
 *  vs.util.isObject (document);
 *  //-> false // YEP !
 *
 *  vs.util.isObject (vs.util);
 *  //-> true
 *
 *  vs.util.isObject (new Date);
 *  //-> false // YEP !
 *
 *  @memberOf vs.util
 *
 * @param {Object} object The object to test.
 **/
function isObject(object) {
  try {
    return Object.getPrototypeOf(object) === Object.prototype;
  } catch (e) {
    return false;
  }
};

/**
 *  Returns `true` if `object` is of type `undefined`; `false` otherwise.
 *
 *  @example
 *
 *  vs.util.isUndefined ();
 *  //-> true
 *
 *  vs.util.isUndefined (undefined);
 *  //-> true
 *
 *  vs.util.isUndefined (null);
 *  //-> false
 *
 *  vs.util.isUndefined (0);
 *  //-> false
 *
 *  @memberOf vs.util
 *
 * @param {Object} object The object to test.
 **/
function isUndefined(object) {
  return typeof object === "undefined";
};

/********************************************************************
                         export
*********************************************************************/

export { isElement, isArray, isFunction, isString, isNumber, isObject, isUndefined };