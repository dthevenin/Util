
import { clone } from './helpers';
import { isString } from './is';

/********************************************************************
                    Array extension
*********************************************************************/

/**
 * Removes the elements in the specified interval of this Array.<br/>
 * Shifts any subsequent elements to the left (subtracts one from their indices).<br/>
 * This method extends the JavaScript Array prototype.
 * By John Resig (MIT Licensed)
 *
 * @param {int} from Index of the first element to be removed
 * @param {int} to Index of the last element to be removed
 */
Array.prototype._remove = function (from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

/**
 * @private
 */
var _findItem = function (obj, from) {
  var len = this.length;

  var from = from ? from : 0;
  from = from < 0 ? 0 : from;

  while (from < len) {
    if (this[from] === obj) {
      return from;
    }
    from++;
  }
  return -1;
};

/**
 *  Find an element into this Array.
 *
 * @param {Object} obj Element to locate in the array
 * @param {number} fromIndex The index at which to begin the search.
 *    Defaults to 0, i.e. the whole array will be searched.
 *    If the index is greater than or equal to the length of the
 *    array, -1 is returned
 * @return {int} the Index of the element. Return -1 if unfound.
 */
Array.prototype.findItem = Array.prototype.indexOf ? Array.prototype.indexOf : _findItem;

/**
 * Removes the elements in the specified interval of this Array.<br/>
 * Shifts any subsequent elements to the left (subtracts one from their indices).<br/>
 * This method extends the JavaScript Array prototype.
 *
 * @param {int} from Index of the first element to be removed
 * @param {int} to Index of the last element to be removed
 * @return {Array} the modified array
 */
Array.prototype.remove = function (from, to) {
  if (typeof from === "object" || isString(from)) {
    var i = 0;
    while (i < this.length) {
      if (this[i] === from) {
        this._remove(i);
      } else {
        i++;
      }
    }
  } else {
    this._remove(from, to);
  }
  return this;
};

/**
 * Removes all elements of this Array.<br/>
 *
 * @return {Array} the modified array
 */
Array.prototype.removeAll = function () {
  while (this.length > 0) {
    this._remove(0);
  }
  return this;
};

/**
 * Return a copy of the array
 *
 * @return {Array} the modified array
 */
Array.prototype.clone = function () {
  var destination = [];
  for (var i = 0; i < this.length; i++) {
    destination[i] = clone(this[i]);
  }
  return destination;
};