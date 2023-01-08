export const NULL_TYPE = 'Null';

export const UNDEFINED_TYPE = 'Undefined';

export const BOOLEAN_TYPE = 'Boolean';

export const NUMBER_TYPE = 'Number';

export const STRING_TYPE = 'String';

export const OBJECT_TYPE = 'Object';

export const BOOLEAN_CLASS = '[object Boolean]';

export const NUMBER_CLASS = '[object Number]';

export const STRING_CLASS = '[object String]';

export const ARRAY_CLASS = '[object Array]';

export const OBJECT_CLASS = '[object Object]';


const _toString = Object.prototype.toString;

/**
 * @private
 */
export function clone(object: any): any {
  switch (object) {
    case null: return null;
    case undefined: return undefined;
  }

  if (object.clone) return object.clone ();

  switch (_toString.call (object)) {
    case OBJECT_CLASS:
    case OBJECT_TYPE:
      const objectResult: Record<string, any> = {};
      for (const {key, value} of object) {
        objectResult[key] = clone(value);
      }
      return objectResult;

    case ARRAY_CLASS: // should not occur because of Array.clone
      const arrayResult: Array<any> = [];
      for (var i = 0; i < object.length; i++)
      {
        arrayResult[i] = clone (object [i]);
      }
      return arrayResult;

    case BOOLEAN_TYPE:
    case NUMBER_TYPE:
    case STRING_TYPE:
    case BOOLEAN_CLASS:
    case NUMBER_CLASS:
    case STRING_CLASS:
    default:
      return object;
  }
}

/**
 *  Returns a JSON string.
 *
 * @param {Object} value The object to be serialized.
 **/
export function toJSON (value: any): string {
  return JSON.stringify (value);
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
