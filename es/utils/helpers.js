/********************************************************************
                    Object management
*********************************************************************/

/**
 * @private
 * @const
 */
const NULL_TYPE = 'Null';

/**
 * @private
 * @const
 */
const UNDEFINED_TYPE = 'Undefined';

/**
 * @private
 * @const
 */
const BOOLEAN_TYPE = 'Boolean';

/**
 * @private
 * @const
 */
const NUMBER_TYPE = 'Number';

/**
 * @private
 * @const
 */
const STRING_TYPE = 'String';

/**
 * @private
 * @const
 */
const OBJECT_TYPE = 'Object';

/**
 * @private
 * @const
 */
const BOOLEAN_CLASS = '[object Boolean]';

/**
 * @private
 * @const
 */
const NUMBER_CLASS = '[object Number]';

/**
 * @private
 * @const
 */
const STRING_CLASS = '[object String]';

/**
 * @private
 * @const
 */
const ARRAY_CLASS = '[object Array]';

/**
 * @private
 * @const
 */
const OBJECT_CLASS = '[object Object]';

/********************************************************************
                    Object management
*********************************************************************/

const _toString = Object.prototype.toString;

/**
 * @private
 */
function clone(object) {
  var destination;

  switch (object) {
    case null:
      return null;
    case undefined:
      return undefined;
  }

  if (object.clone) return object.clone();

  switch (_toString.call(object)) {
    case OBJECT_CLASS:
    case OBJECT_TYPE:
      destination = {};
      for (var property in object) {
        destination[property] = clone(object[property]);
      }
      return destination;

    case ARRAY_CLASS:
      // should not occur because of Array.clone
      destination = [];
      for (var i = 0; i < object.length; i++) {
        destination[i] = clone(object[i]);
      }
      return destination;

    case BOOLEAN_TYPE:
    case NUMBER_TYPE:
    case STRING_TYPE:
    case BOOLEAN_CLASS:
    case NUMBER_CLASS:
    case STRING_CLASS:
    default:
      return object;
  }
};

/**
 *  Returns a JSON string.
 *
 *  @memberOf vs.util
 *
 * @param {Object} value The object to be serialized.
 **/
function toJSON(value) {
  return JSON.stringify(value);
};

/********************************************************************
                         export
*********************************************************************/

export { NULL_TYPE, UNDEFINED_TYPE, BOOLEAN_TYPE, NUMBER_TYPE, STRING_TYPE, OBJECT_TYPE, BOOLEAN_CLASS, NUMBER_CLASS, STRING_CLASS, ARRAY_CLASS, OBJECT_CLASS, clone,

// JSON functions
toJSON, _toString };