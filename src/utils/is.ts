import { STRING_CLASS } from './types';

/**
 * @private
 **/
const { toString } = Object.prototype;

/**
 *  Returns `true` if `object` is a DOM node of type 1; `false` otherwise.
 *
 *  @example
 *
 *  vs.helper.isElement(new Element('div'));
 *  //-> true
 *
 *  vs.helper.isElement(document.createElement('div'));
 *  //-> true
 *
 *  vs.helper.isElement(document.createTextNode('foo'));
 *  //-> false
 *
 *
 * @param {Object} object The object to test.
 **/
export const isElement = (object: any): object is HTMLElement => object?.nodeType === 1;

/**
 *  Returns `true` if `object` is an [[Array]]; `false` otherwise.
 *
 *  @example
 *
 *  vs.helper.isArray([]);
 *  //-> true
 *
 *  vs.helper.isArray({ });
 *  //-> false
 *
 *
 * @param {Object} object The object to test.
 **/
export const { isArray } = Array;

/**
 *  Returns `true` if `object` is a Function; `false` otherwise.
 *
 *
 * @param {Object} object The object to test.
 **/
export const isFunction = (object: unknown): object is Function => typeof object === "function";

/**
 *  Returns `true` if `object` is an String; `false` otherwise.
 *
 *  @example
 *
 *  vs.helper.isString ("qwe");
 *  //-> true
 *
 *  vs.helper.isString (123);
 *  //-> false
 *
 *
 * @param {Object} object The object to test.
 **/
export const isString = (object: unknown): object is string => toString.call (object) === STRING_CLASS;

/**
 *  Returns `true` if `object` is an Number; `false` otherwise.
 *
 *  @example
 *
 *  vs.helper.isNumber (123);
 *  //-> true
 *
 *  vs.helper.isNumber (1.23);
 *  //-> true
 *
 *  vs.helper.isNumber ("123");
 *  //-> false
 *
 *
 * @param {Object} object The object to test.
 **/
export const isNumber = (object: unknown): object is number =>
  (typeof object === 'number' && isFinite(object)) || object instanceof Number;

/**
 *  Returns `true` if `object` is an "pure" Object; `false` otherwise.
 *
 *  @example
 *  vs.helper.isObject (123);
 *  //-> false
 *  vs.helper.isObject ([]);
 *  //-> false
 *  vs.helper.isObject ({});
 *  //-> true
 *  vs.helper.isObject (document);
 *  //-> false // YEP !
 *  vs.helper.isObject (vs.helper);
 *  //-> true
 *  vs.helper.isObject (new Date);
 *  //-> false // YEP !
 *
 * @param {Object} obj The object to test.
 **/
export function isObject(obj: unknown): obj is object {
  try {
    return (Object.getPrototypeOf (obj) === Object.prototype);
  } catch (e) {
    return false;
  }
}

/**
 *  Returns `true` if `object` is of type `undefined`; `false` otherwise.
 *
 *  @example
 *
 *  vs.helper.isUndefined ();
 *  //-> true
 *
 *  vs.helper.isUndefined (undefined);
 *  //-> true
 *
 *  vs.helper.isUndefined (null);
 *  //-> false
 *
 *  vs.helper.isUndefined (0);
 *  //-> false
 *
 *
 * @param {Object} object The object to test.
 **/
export const isUndefined = (object: unknown): object is undefined => typeof object === "undefined";

/**
 *  Returns `true` if `object` is a Date; `false` otherwise.
 *
 * * @param {Object} object The object to test.
 *  **/
export const isDate = (object: unknown): object is Date => object instanceof Date;
