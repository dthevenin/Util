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
declare const isElement: (object: any) => object is HTMLElement;
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
declare const isArray: (arg: any) => arg is any[];
/**
 *  Returns `true` if `object` is a Function; `false` otherwise.
 *
 *
 * @param {Object} object The object to test.
 **/
declare const isFunction: (object: unknown) => object is Function;
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
declare const isString: (object: unknown) => object is string;
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
declare const isNumber: (object: unknown) => object is number;
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
 * @param {Object} object The object to test.
 **/
declare function isObject(object: unknown): object is Record<string, any>;
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
declare const isUndefined: (object: unknown) => object is undefined;
/**
 *  Returns `true` if `object` is a Date; `false` otherwise.
 *
 * * @param {Object} object The object to test.
 *  **/
declare const isDate: (object: unknown) => object is Date;

/**
 * HTML-encodes a string and returns the encoded string.
 *
 * @param {String} str String The string
 */
declare const htmlEncode: (str: string) => string;
/**
 *  Strips all leading and trailing whitespace from a string.
 *
 * @param {String} str String The string
 */
declare const strip: (str: string) => string;
/**
 *  Converts a string separated by dashes into a camelCase equivalent
 *
 * @param {String} str String The string
 * @return {String} the result
 */
declare function camelize(str: string): string;
/**
 *  Converts a string separated by dashes into a camelCase equivalent
 *
 * @param {String} str String The string
 * @return {String} the result
 */
declare const capitalize: (str: string) => string;
/**
 *  Converts a caramelized string into a series of words separated by an
 *  underscore (_).
 *
 * @param {String} str String The string
 * @return {String} the result
 */
declare const underscore: (str: string) => string;
/**
 *  Parse a json string. <p/>
 *  This function use the JSON.parse function and manages also
 *  Date parsing which is not supported by the JSON.parse
 *  @ignore
 *
 * @param {String} json String The string
 * @return {Object} the result
 */
declare function parseJSON(json: string): any;

type ArrayT = Array<any> | Float32Array | number;
declare function arrayDeepClone<T extends ArrayT>(data: T): T;
declare function arrayRemove<T>(array: Array<T>, entry: T): Array<T>;

/**
 * Imports a JavaScript or css file into a document
 *
 * @param {String} path The file path to import
 * @param {String} type The file type ['js', 'css']
 * @param {Function} clb A function which will be called when the file is loaded
 * @param {Document} doc The document into import the file
 * @param first insert first. Optional, by default insert at the end
 */
declare function importFile(path: string, type: 'js' | 'css', clb?: (path: string) => void, doc?: Document, first?: boolean): void;

type ConstructorType<T = any> = new (...args: any[]) => T;
type Func<R, T1 = never, T2 = never, T3 = never, T4 = never, T5 = never> = (arg1?: T1, arg2?: T2, arg3?: T3, arg4?: T4, arg5?: T5) => R;

declare const isPowerOfTwo: (x: number) => boolean;

export { ConstructorType, Func, arrayDeepClone, arrayRemove, camelize, capitalize, htmlEncode, importFile, isArray, isDate, isElement, isFunction, isNumber, isObject, isPowerOfTwo, isString, isUndefined, parseJSON, strip, underscore };
