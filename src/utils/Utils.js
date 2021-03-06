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

import Point from './Point';
import CSSMatrix from './CSSMatrix';
import {
  isElement,
  isArray,
  isFunction,
  isString,
  isNumber,
  isObject,
  isUndefined
} from './is';

/********************************************************************

*********************************************************************/

var document = (typeof window != "undefined")?window.document:null;

/**
 * Create our "vsTest" element and style that we do most feature tests on.
 * @private
 */
var vsTestElem = (document)?document.createElement ('vstestelem'):null;

/**
 * @private
 */
var vsTestStyle = (vsTestElem)?vsTestElem.style:null;
let SUPPORT_3D_TRANSFORM = false;
let CSS_VENDOR;

if (vsTestStyle)
{
  if (vsTestStyle.webkitTransform !== undefined)
    SUPPORT_3D_TRANSFORM =
      'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix ();

  else if (vsTestStyle.MozTransform !== undefined)
    SUPPORT_3D_TRANSFORM = 'MozPerspective' in vsTestStyle;

  else if (vsTestStyle.msTransform !== undefined)
    SUPPORT_3D_TRANSFORM =
     'MSCSSMatrix' in window && 'm11' in new MSCSSMatrix ();

  CSS_VENDOR = (function () {
    var vendors = ['MozT', 'msT', 'OT', 'webkitT', 't'],
      transform,
      l = vendors.length;

    while (--l) {
      transform = vendors[l] + 'ransform';
      if ( transform in vsTestStyle ) return vendors[l].substr(0, vendors[l].length-1);
    }

    return null;
  })();
}

const SUPPORT_CSS_TRANSFORM = (CSS_VENDOR !== null) ? true : false;


/**
 * Tells the browser that you wish to perform an animation and requests
 * that the browser schedule a repaint of the window for the next animation
 * frame. The method takes as an argument a callback to be invoked before
 * the repaint.
 *
 * @public
 * @function
 * @memberOf vs
 *
 * @param {Function} callback A parameter specifying a function to call
 *        when it's time to update your animation for the next repaint.
 */
const _requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (callback) { window.setTimeout (callback, 1000 / 60); };

const requestAnimationFrame = _requestAnimationFrame.bind (window);

const _cancelRequestAnimationFrame = window.cancelRequestAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.mozCancelAnimationFrame ||
  window.oCancelAnimationFrame ||
  window.msCancelAnimationFrame ||
  clearTimeout;

const cancelRequestAnimationFrame = _cancelRequestAnimationFrame.bind (window);

const _setImmediate =
  window.setImmediate ||
  function (func, args) { return this.setTimeout (func, 0, args); };

const setImmediate = _setImmediate.bind (window);
  
const _clearImmediate = window.clearImmediate || window.clearTimeout;
const clearImmediate = _clearImmediate.bind (window);

/********************************************************************

*********************************************************************/

/**
 * extend with __defineSetter__/__defineGetter__ compatible API
 *
 * @private
 */
function _extend_api1 (destination, source)
{
  for (var property in source)
  {
    getter = source.__lookupGetter__ (property);
    setter = source.__lookupSetter__ (property);

    if (getter)
    {
      destination.__defineGetter__ (property, getter)
    }
    if (setter)
    {
      destination.__defineSetter__ (property, setter)
    }
    if (!getter && !setter)
    {
      destination [property] = source [property];
    }
  }
  return destination;
}

/**
 * extend with Object.defineProperty compatible API
 *
 * @private
 */
function _extend_api2 (destination, source)
{
  for (var property in source)
  {
    var desc = Object.getOwnPropertyDescriptor (source, property);

    if (desc && (desc.get || desc.set))
    {
      defineProperty (destination, property, desc);
    }
    else
    {
      destination [property] = source [property];
    }
  }
  return destination;
}

/**
 * Copies all properties from the source to the destination object.
 *
 * @memberOf vs.util
 *
 * @param {Object} destination The object to receive the new properties.
 * @param {Object} source The object whose properties will be duplicated.
 **/
const extend = (Object.defineProperty)?_extend_api2:_extend_api1;

/**
 * Extends a the prototype of a object
 *
 * @memberOf vs.util
 *
 * @param {Object} destination The Class to receive the new properties.
 * @param {Object} source The Class whose properties will be duplicated.
 **/
var extendClass = function (obj, extension)
{
  if (!obj || !extension) { return; }
  if (!obj.prototype || !extension.prototype) { return; }

  try
  {
    if (Object.__proto__)
    {
      obj.prototype.__proto__ = extension.prototype;
    }
    else
    {
      var proto = obj.prototype;
      obj.prototype = new extension ();

      extend (obj.prototype, proto);
    }

    if (!obj.__properties__) obj.__properties__ = [];
    if (extension.__properties__)
    {
      obj.__properties__ = obj.__properties__.concat (extension.__properties__);
    }

    return obj;
  }
  catch (e)
  {
    console.error (e.message ());
  }
}

/**
 * Free a ViniSketch object
 *
 * @memberOf vs.util
 *
 * @param {Object} obj the object to free
 */
function free (obj)
{
  if (!obj) { return; }
  if (obj._free) { obj._free (); }
  if (obj.destructor) { obj.destructor (); }
}

/**
 * Defines a new property directly on an object, or modifies an existing
 * property on an object.<br/><br/>
 *
 * Property descriptors present in objects come in two main flavors: data
 * descriptors and accessor descriptors. A data descriptor is a property that
 * has a value, which may or may not be writable. An accessor descriptor is a
 * property described by a getter-setter pair of functions. A descriptor must be
 * one of these two flavors; it cannot be both. All descriptors regardless of
 * flavor include the configurable and enumerable fields.<br/><br/>
 *
 * A property descriptor is an object with the following fields:
 * <ul>
 * <ol> <b>value</b> The value associated with the property. (data descriptors
 * only). <br/><i>Defaults to undefined.</i></ol>
 * <ol> <b>writable</b> True if and only if the value associated with the
 * property may be changed. (data descriptors only).<br/>
 * <i>Defaults to false.</ol>
 * <ol> <b>get</b> A function which serves as a getter for the property, or
 * undefined if there is no getter. (accessor descriptors only).<br/>
 * <i>Defaults to undefined.</i></ol>
 * <ol> <b>set</b> A function which serves as a setter for the property, or
 * undefined if there is no setter. (accessor descriptors only).<br/>
 * <i>Defaults to undefined.</i></ol>
 * <ol> <b>configurable</b> True if and only if the type of this property
 * descriptor may be changed and if the property may be deleted from the
 * corresponding object.<br/><i>Defaults to true.</i></ol>
 * <ol> <b>enumerable</b> True if and only if this property shows up during
 * enumeration of the properties on the corresponding object. <br/>
 * Defaults to true.</i></ol></ul>
 *
 * @memberOf vs.util
 *
 * @param {Object} obj The object on which to define the property.
 * @param {String} prop_name The name of the property to be defined or modified.
 * @param {Object} desc The descriptor for the property being defined or
 * modified
 */


/**
 * defineProperty with __defineSetter__/__defineGetter__ API
 *
 * @private
 */
function _defineProperty_api1 (obj, prop_name, desc)
{
  function hasProperty (obj, prop)
  {
    return Object.prototype.hasOwnProperty.call (obj, prop);
  }

  if (hasProperty (desc, "set"))
  {
    var s = desc.set;
    if (isFunction (s)) obj.__defineSetter__(prop_name, s);
  }

  if (hasProperty (desc, "get"))
  {
    var s = desc.get;
    if (isFunction (s)) obj.__defineGetter__(prop_name, s);
  }
}

/**
 * defineProperty with Object.defineProperty API
 *
 * @private
 */
function _defineProperty_api2 (obj, prop_name, desc)
{
  function hasProperty (obj, prop)
  {
    return Object.prototype.hasOwnProperty.call (obj, prop);
  }

  if (typeof desc != "object" || desc === null)
  {
    throw new TypeError ("bad desc");
  }

  if (typeof prop_name != "string" || prop_name === null)
  {
    throw new TypeError ("bad property name");
  }

  var d = {};

  if (hasProperty (desc, "enumerable")) d.enumerable = !!desc.enumerable;
  else d.enumerable = true;
  if (hasProperty (desc, "configurable")) d.configurable = !!desc.configurable;
  else d.configurable = true;
  if (hasProperty (desc, "value")) d.value = desc.value;
  if (hasProperty (desc, "writable")) d.writable = !!desc.writable;
  if (hasProperty (desc, "get"))
  {
    var g = desc.get;
    if (isFunction (g)) d.get = g;
  }
  if (hasProperty (desc, "set"))
  {
    var s = desc.set;
    if (isFunction (s)) d.set = s;
  }

  if (("get" in d || "set" in d) && ("value" in d || "writable" in d))
    throw new TypeError("identity-confused descriptor");

  Object.defineProperty (obj, prop_name, d);
}

/**
 * Defines a new property directly on the object's prototype, or modifies an
 * existing property on an object's prototype.<br/><br/>
 *
 * Property descriptors present in objects come in two main flavors: data
 * descriptors and accessor descriptors. A data descriptor is a property that
 * has a value, which may or may not be writable. An accessor descriptor is a
 * property described by a getter-setter pair of functions. A descriptor must be
 * one of these two flavors; it cannot be both. All descriptors regardless of
 * flavor include the configurable and enumerable fields.<br/><br/>
 *
 * A property descriptor is an object with the following fields:
 * <ul>
 * <ol> <b>value</b> The value associated with the property. (data descriptors
 * only). <br/><i>Defaults to undefined.</i></ol>
 * <ol> <b>writable</b> True if and only if the value associated with the
 * property may be changed. (data descriptors only).<br/>
 * <i>Defaults to false.</ol>
 * <ol> <b>get</b> A function which serves as a getter for the property, or
 * undefined if there is no getter. (accessor descriptors only).<br/>
 * <i>Defaults to undefined.</i></ol>
 * <ol> <b>set</b> A function which serves as a setter for the property, or
 * undefined if there is no setter. (accessor descriptors only).<br/>
 * <i>Defaults to undefined.</i></ol>
 * <ol> <b>configurable</b> True if and only if the type of this property
 * descriptor may be changed and if the property may be deleted from the
 * corresponding object.<br/><i>Defaults to true.</i></ol>
 * <ol> <b>enumerable</b> True if and only if this property shows up during
 * enumeration of the properties on the corresponding object. <br/>
 * Defaults to true.</i></ol></ul>
 *
 * @memberOf vs.util
 *
 * @param {Object} the_class The object's prototype on which to define the
 * property.
 * @param {String} prop_name The name of the property to be defined or modified.
 * @param {Object} desc The descriptor for the property being defined or
 * modified
 */
function defineClassProperty (the_class, prop_name, desc)
{
  if (!desc) { return; }
  if (!the_class.__properties__) the_class.__properties__ = [];
  if (!the_class.prototype) {
    throw ("defineClassProperty on a Class without prototype");
  }
  defineProperty (the_class.prototype, prop_name, desc);
  if (desc.enumerable != false) the_class.__properties__.push (prop_name);
}

/**
 * Defines new or modifies existing properties directly on an 'class'.<br/><br/>
 *
 * @see vs.util.defineClassProperty
 *
 * @memberOf vs.util
 *
 * @param {Object} the_class The 'class' on which to define the property.
 * @param {Object} properties An object whose own enumerable properties
 *   constitute descriptors for the properties to be defined or modified.
 */
function defineClassProperties (the_class, properties)
{
  if (!the_class.prototype) {
    throw ("defineClassProperties on a Class without prototype");
  }

  var keys = Object.keys (properties), i = 0, l = keys.length, prop_name, desc;
  for (; i < l; i++)
  {
    prop_name = keys [i]
    desc = properties [prop_name];
    defineClassProperty (the_class, prop_name, desc);
  }
}



/********************************************************************
                    Element Class testing
*********************************************************************/

/**
 *  Checks whether element has the given CSS className.
 *
 *  <p>
 *  @example
 *  elem.hasClassName ('selected');
 *  // -> true | false
 *
 *  @memberOf vs.util
 *
 * @param {String} className the className to check
 * @return {Boolean} true if the element has the given className
*/
function hasClassName (element, className)
{
  if (!element) { return; }
  var elementClassName = element.className;
  return (elementClassName && elementClassName.length > 0 &&
    (elementClassName === className ||
    new RegExp("(^|\\s)" + className + "(\\s|$)").test(elementClassName)));
}

/**
 *  Adds a CSS classname to Element.
 *
 *  @example
 *  elem.addClassName ('selected');
 *
 *  @memberOf vs.util
 *
 * @param {String} className the className to add
*/
function addClassName ()
{
  var element = arguments [0], className, i = 1, l = arguments.length;
  if (!element) { return; }

  if (element.classList) {
    for (; i < l; i++) {
      element.classList.add (arguments [i]);
    }
    return element;
  }

  for (; i < l; i++)
  {
    className = arguments [i];
    if (!hasClassName(element, className)) {
      element.className = (element.className ? element.className + ' ' : '') + className;
    }
  }
  return element;
}

/**
 *  Removes element’s CSS className
 *
 *  <p>
 *  @example
 *  elem.removeClassName ('selected');
 *
 *  @memberOf vs.util
 *
 * @param {String} className the className to remove
*/
function removeClassName ()
{
  var element = arguments [0], className, i = 1, l = arguments.length;
  if (!element || !element.className) { return; }
  
  if (element.classList) {
    for (; i < l; i++) {
      element.classList.remove (arguments [i]);
    }
    return element;
  }
  
  for (; i < l; i++) {
    className = arguments [i];
    element.className = strip (element.className.replace (
      new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' '));
  }
  return element;
}

/**
 *  Toggles element’s CSS className
 *
 *  <p>
 *  @example
 *  elem.toggleClassName ('selected');
 *
 *  @memberOf vs.util
 *
 * @param {String} className the className
*/
function toggleClassName (element, className)
{
  if (!element) { return; }

  if (element.classList) {
    element.classList.toggle (className);
    return element;
  }

  return hasClassName(element, className) ?
    removeClassName(element, className): addClassName(element, className);
}

/********************************************************************
                    Element management
*********************************************************************/

/**
 *  Returns the height of `element`.<br/>
 *
 *  This method returns correct values on elements whose display is set to
 *  `none` either in an inline style rule or in an CSS stylesheet.
 *
 *  @memberOf vs.util
 *
 * @param {Element} elem The element
 *	@returns {Number} the height
 **/
function getElementHeight (elem)
{
  if (!isElement (elem)) return;

  return getElementDimensions (elem).height;
};

/**
 *  Returns the width of `element`.<br/>
 *
 *  This method returns correct values on elements whose display is set to
 *  `none` either in an inline style rule or in an CSS stylesheet.
 *
 *  @memberOf vs.util
 *
 * @param {Element} elem The element
 *	@returns {Number} the width
 **/
function getElementWidth (elem)
{
  if (!isElement (elem)) return;

  return getElementDimensions (elem).width;
};

/**
 *  Finds the computed width and height of `element` and returns them as
 *  key/value pairs of an object.<br/>
 *  <p/>
 *  For backwards-compatibility, these dimensions represent the dimensions
 *  of the element's "border box" (including CSS padding and border).<br/> This
 *  is equivalent to the built-in `offsetWidth` and `offsetHeight`
 *  browser properties.
 *
 *  @memberOf vs.util
 *
 * @param {Element} elem The element
 *	@returns {Object} the key/value width & height
 **/
function getElementDimensions (elem)
{
  if (!isElement (elem)) return {};

  var display = getElementStyle (elem, 'display'),
    els = elem.style, originalVisibility = els.visibility,
    originalPosition = els.position, originalDisplay = els.display,
    originalWidth = 0, originalHeight = 0;

  if (display !== 'none' && display !== null) // Safari bug
  {
    return {width: elem.offsetWidth, height: elem.offsetHeight};
  }
  // All *Width and *Height properties give 0 on elements with display none,
  // so enable the element temporarily

  els.visibility = 'hidden';
  els.position = 'absolute';
  els.display = 'block';

  originalWidth = elem.clientWidth;
  originalHeight = elem.clientHeight;
  els.display = originalDisplay;
  els.position = originalPosition;
  els.visibility = originalVisibility;

  return {width: originalWidth, height: originalHeight};
};

/**
 *  Returns the given CSS property value of `element`.<br/> The property can be
 *  specified in either its CSS form (`font-size`) or its camelized form
 *  (`fontSize`).<br/>
 *
 *  This method looks up the CSS property of an element whether it was
 *  applied inline or in a stylesheet. It works around browser inconsistencies
 *  regarding `float`, `opacity`, which returns a value between `0`
 *  (fully transparent) and `1` (fully opaque), position properties
 *  (`left`, `top`, `right` and `bottom`) and when getting the dimensions
 *  (`width` or `height`) of hidden elements.
 *
 *  @example
 *
 *  getElementStyle (elem, 'fontSize');
 *  // -> '12px'
 *
 *  @memberOf vs.util
 *
 * @param {Element} elem The element
 * @param {String} style The style to find
 *	@returns {Object} the key/value width & height
 **/
function getElementStyle (elem, style)
{
  if (!isElement (elem)) return;

  style = style === 'float' ? 'cssFloat' : camelize (style);
  var value = elem.style[style], css;
  if (!value || value === 'auto')
  {
    css = document.defaultView.getComputedStyle (elem, null);
    value = css ? css[style] : null;
  }
  if (style === 'opacity') { return value ? parseFloat (value) : 1.0; }
  return value === 'auto' ? null : value;
};

/**
 *  Modifies `element`'s CSS style properties. Styles are passed as a hash of
 *  property-value pairs in which the properties are specified in their
 *  camelized form.
 *
 * @example
 * setElementStyle ({color: 'red', display: 'block'});
 * // add/set color and display properties
 * setElementStyle ({color: undefined});
 * // remove color property
 *
 *  @memberOf vs.util
 *
 * @param {Element} elem The element
 * @param {Object} style The style to modify
 */
function setElementStyle (elem, styles)
{
  if (!isElement (elem)) return;

  var elementStyle = elem.style, property;

  for (property in styles)
  {
    if (property === 'opacity')
    {
      setElementOpacity (elem, styles[property]);
    }
    else
    {
      if (!styles [property])
      {
        elementStyle.removeProperty (property);
      }
      elementStyle[(property === 'float' || property === 'cssFloat') ?
        (isUndefined(elementStyle.styleFloat) ? 'cssFloat' : 'styleFloat') :
          property] = styles[property];
    }
  }
};

/**
 *  Sets the visual opacity of an element while working around inconsistencies
 *  in various browsers. The `opacity` argument should be a floating point
 *  number, where the value of `0` is fully transparent and `1` is fully opaque.
 *
 *  @example
 *  // set to 50% transparency
 *  setElementOpacity (element, 0.5);
 *
 *  // these are equivalent, but allow for setting more than
 *  // one CSS property at once:
 *  setElementStyle (element, { opacity: 0.5 });
 *  setElementStyle (element, "opacity: 0.5");
 *
 *  @memberOf vs.util
 *
 * @param {Element} elem The element
 * @param {Number} value The opacity
 **/
function setElementOpacity (elem, value)
{
  if (!isElement (elem)) return;
  var elementStyle = elem.style;

  if (isUndefined (value)) elementStyle.removeProperty ('opacity');

  elementStyle.opacity = (value === 1 || value === '') ? '' :
    (value < 0.00001) ? 0 : value;
};

/**
 *  Returns the opacity of the element.
 *
 *  @memberOf vs.util
 *
 * @param {Element} elem The element
 * @return {Number} value The opacity
 **/
function getElementOpacity (elem)
{
  if (!isElement (elem)) return;

  return getElementStyle (elem, 'opacity');
};

/**
 * Compute the elements position in terms of the window viewport
 * Returns a vs.Point {x, y}
 *
 *  @memberOf vs.util
 *
 * @return {vs.Point} the x,y absolute position of a element
 **/
function getElementAbsolutePosition (element, force)
{
  if (!element)
  { return null; }
  if (!force && element.getBoundingClientRect)
  {
    var rec = element.getBoundingClientRect ();
    if (rec) { return new Point (rec.left, rec.top); }
  }
  var
    x = 0, y = 0,
    parent = element,
    borderXOffset = 0,
    borderYOffset = 0;
    
  while (parent)
  {
    borderXOffset = 0;
    borderYOffset = 0;
    if (parent != element)
    {
      borderXOffset = parseInt (
        parent.currentStyle?
        parent.currentStyle ["borderLeftWidth"]:0, 0);
      borderYOffset = parseInt (
        parent.currentStyle?
        parent.currentStyle ["borderTopWidth"]:0, 0);
      borderXOffset = isNaN (borderXOffset) ? 0 : borderXOffset;
      borderYOffset = isNaN (borderYOffset) ? 0 : borderYOffset;
    }

    if (parent instanceof HTMLBodyElement) {
      x += parent.offsetLeft - document.documentElement.scrollLeft + borderXOffset;
      y += parent.offsetTop - document.documentElement.scrollTop + borderYOffset;
      parent = null;
    }
    else {
      x += parent.offsetLeft - parent.scrollLeft + borderXOffset;
      y += parent.offsetTop - parent.scrollTop + borderYOffset;
      parent = parent.offsetParent;
    }
  }
  return new Point (x, y);
}

/**
 * @private
 */
function _getBoundingClientRect_api1 (e)
{
  var rec = getElementAbsolutePosition (e);
  return {
    width: e.offsetWidth,
    height: e.offsetWidth,
    left: rec.x,
    top: rec.y
  }
};

/**
 * @private
 */
function _getBoundingClientRect_api2 (e)
{
  return (e && e.getBoundingClientRect)?e.getBoundingClientRect ():null;
};

/**
 *  Set the absolute element position.
 *
 *  @memberOf vs.util
 *
 * @param {Element} elem The element
 * @param {Number} x The element left position
 * @param {Number} y The element top position
 **/
function setElementPos (elem, x, y)
{
  if (!elem) { return; }
  var elementStyle = elem.style;

  elementStyle.left = x + 'px';
  elementStyle.top = y + 'px';
}

/**
 * Set the element size
 *
 *  @memberOf vs.util
 *
 * @param {Element} elem The element
 * @param {Number} w The element width
 * @param {Number} w The element height
 **/
function setElementSize (elem, w, h)
{
  if (!elem) { return; }
  var elementStyle = elem.style;

  elementStyle.width = w + 'px';
  elementStyle.height = h + 'px';
}

/**
 *  Set the element HTML visibility
 *
 *  @memberOf vs.util
 *
 * @param {Element} elem The element
 * @param {boolean} v True if the element should be visible or false
 **/
function setElementVisibility (elem, v)
{
  if (!elem) { return; }
  var elementStyle = elem.style;

  if (elementStyle || isString (elem.innerHTML))
  {
    if (v)
    {
      elementStyle.visibility = 'visible';
    }
    else
    {
      elementStyle.visibility = 'hidden';
    }
  }
//  else if (elem instanceof CharacterData)
//  {}
  else // SVG
  {
    if (v)
    {
      elem.setAttribute ('visibility', 'visible');
    }
    else
    {
      elem.setAttribute ('visibility', 'hidden');
    }
  }
}

/**
 *  Return true if the element is visible, false otherwise
 *
 *  @memberOf vs.util
 *
 * @param {Element} elem The element
 * @return {boolean}
 **/
function isElementVisible (elem)
{
  if (!elem) { return false; }
  var elementStyle = elem.style;

  if (elementStyle || isString (elem.innerHTML))
  {
    if (elementStyle.visibility === 'hidden') { return false; }
    else { return true; }
  }
  else if (elem instanceof CharacterData)
  {
    return true;
  }
  else // SVG
  {
    if (elem.getAttribute ('visibility') === 'hidden') { return false; }
    else { return true; }
  }
}

/**
 *  Remove all element children
 *
 *  @memberOf vs.util
 *
 * @param {Element} elem The element
 **/
function removeAllElementChild (elem)
{
  if (!elem || !elem.childNodes) { return; }

  var l = elem.childNodes.length;
  while (l--)
  {
    elem.removeChild (elem.firstChild);
  }
};

/**
 *  Safe set inner HTML of a element
 *
 *  @memberOf vs.util
 *
 * @param {Element} elem The element
 * @param {String} txt The text
 **/
function safeInnerHTML (elem, html_text)
{
  if (!elem || !isString (html_text)) { return; }

  // MS Window 8 management
  if (window.MSApp && window.MSApp.execUnsafeLocalFunction)
    window.MSApp.execUnsafeLocalFunction (function() {
      elem.innerHTML = html_text;
    });
  else
  {
    // deactivated because to restrictive
    // if (window.toStaticHTML) html_text = window.toStaticHTML (html_text);
    elem.innerHTML = html_text;
  }
};

/**
 *  Set inner Text content of a element
 *
 *  @memberOf vs.util
 *
 * @param {Element} elem The element
 * @param {String} txt The text
 **/
function setElementInnerText (elem, text)
{
  if (!elem) { return; }

  removeAllElementChild (elem); //... deroule

  if (!isString (text))
  {
    if (text === undefined) { text = ""; }
    else if (text === null) { text = ""; }
    else if (isNumber (text)) { text = "" + text; }
    else if (text.toString) { text = text.toString (); }
    else { text = ""; }
  }
  var lines = text.split ('\n'), i = 0;
  if (!lines.length) { return; }
  elem.appendChild (document.createTextNode (lines [i]));
  i++;
  for (; i < lines.length; i++)
  {
    elem.appendChild (document.createElement ('br'));
    elem.appendChild (document.createTextNode (lines [i]));
  }
};

/**
 *@private
 */
function setElementWebkitTransform (elem, transform)
{
  if (elem && elem.style) elem.style.webkitTransform = transform;
  else console.warn ("setElementTransform, elem null or without style");
}

/**
 *@private
 */
function getElementWebkitTransform (elem)
{
  if (elem) return elem.style.webkitTransform;
}

/**
 *@private
 */
function setElementMSTransform (elem, transform)
{
  if (elem && elem.style) elem.style.msTransform = transform;
  else console.warn ("setElementTransform, elem null or without style");
}

/**
 *@private
 */
function getElementMSTransform (elem)
{
  if (elem) return elem.style.msTransform;
}

/**
 *@private
 */
function setElementMozTransform (elem, transform)
{
  if (elem && elem.style) elem.style.MozTransform = transform;
  else console.warn ("setElementTransform, elem null or without style");
}

/**
 *@private
 */
function getElementMozTransform (elem)
{
  if (elem) return elem.style.MozTransform;
}

/**
 *@private
 */
function _setElementTransform (elem, transform)
{
  if (elem && elem.style) elem.style.transform = transform;
  else console.warn ("setElementTransform, elem null or without style");
}

/**
 *@private
 */
function _getElementTransform (elem)
{
  if (elem) return elem.style.transform;
}

/**
 *  Set the CSS transformation to a element
 *
 *  @memberOf vs.util
 *
 * @param {Element} elem The element
 * @param {String} transform css transformations
 **/
var setElementTransform;

/**
 *  get the CSS transformation to a element
 *
 *  @memberOf vs.util
 *
 * @param {Element} elem The element
 * @return {Transform} transform css transformations
 **/
var getElementTransform;

if (vsTestStyle && vsTestStyle.transform !== undefined)
{
  setElementTransform = _setElementTransform;
  getElementTransform = _getElementTransform;
}
else if (vsTestStyle && vsTestStyle.webkitTransform !== undefined)
{
  setElementTransform = setElementWebkitTransform;
  getElementTransform = getElementWebkitTransform;
}
else if (vsTestStyle && vsTestStyle.msTransform !== undefined)
{
  setElementTransform = setElementMSTransform;
  getElementTransform = getElementMSTransform;
}
else if (vsTestStyle && vsTestStyle.MozTransform !== undefined)
{
  setElementTransform = setElementMozTransform;
  getElementTransform = getElementMozTransform;
}

/**
 *  get the Matrix transformation to a element
 *
 *  @memberOf vs.util
 *
 * @param {Element} elem The element
 * @return {vs.CSSMatrix} matrix3d css transformation
 **/
function getElementMatrixTransform (elem) {
  if (!elem) return;

  var
    css = document.defaultView.getComputedStyle (elem, null),
    transformMatrix;

  if (css.transform) transformMatrix = css.transform;
  else if (css.webkitTransform) transformMatrix = css.webkitTransform;
  else if (css.msTransform) transformMatrix = css.msTransform;
  else if (css.MozTransform) transformMatrix = css.MozTransform;
  
  if (transformMatrix) return new CSSMatrix (transformMatrix);
}

/**
 *  Set the CSS transformation to a element
 *
 *  @memberOf vs.util
 *
 * @param {Element} elem The element
 * @param {String} origin. The value is a CSS string. Ex: '50% 0%',
 *                 or '10px 10px'
 **/
function setElementTransformOrigin (elem, value)
{
  if (elem && elem.style)
  {
    elem.style ['-' + CSS_VENDOR.toLowerCase () + '-transform-origin'] = value;
  }
  else console.warn ("setElementTransformOrigin, elem null or without style");
}

/********************************************************************
                         export
*********************************************************************/

/**
 * Imports a JavaScript or css file into a document
 *
 * @memberOf vs.util
 *
 * @param {String} path The file path to import
 * @param {Document} doc The document into import the file
 * @param {Function} clb A function which will be called when the file is loaded
 * @param {String} type The file type ['js', 'css']
 *
 * @return {Script|Link} Returns a script or link element add to the document
 */
function importFile (path, doc, clb, type, first)
{
  if (!doc) { doc = document; }

  var js_effets, css_style;

  if (type === 'js' || path.search ('\\.js') >= 0)
  {
    js_effets = doc.createElement ("script");
    js_effets.setAttribute ("type", "text/javascript");
    js_effets.setAttribute ("src", path);
    if (clb)
    {
      js_effets.onload = function ()
      {
        clb.call (this, path);
      };
    }
    if (!doc.head) { doc.head = doc.querySelector ('head'); }
    
    if (first && doc.head.firstElementChild) {
      doc.head.insertBefore (js_effets, doc.head.firstElementChild);
    }
    else
      doc.head.appendChild (js_effets);

    return js_effets;
  }
  else if (type === 'css' || path.search('\\.css') >= 0)
  {
    css_style = doc.createElement ("link");
    css_style.setAttribute ("rel", "stylesheet");
    css_style.setAttribute ("type", "text/css");
    css_style.setAttribute ("href", path);
    css_style.setAttribute ("media", "screen");
    if (isFunction (clb))
    {
      var count = 0;

      /**
       * @private
       */
      (function()
      {
        if (!css_style.sheet)
        {
          if (count++ < 100)
          {
            cssTimeout = setTimeout (arguments.callee, 100);
          }
          else
          {
            console.error ('CSS load of ' + path + ' failed!');
          }
          return;
        };
        clb.call (document, path);
      })();
    }
    if (!doc.head) { doc.head = doc.querySelector ('head'); }
    
    if (first && doc.head.firstElementChild) {
      doc.head.insertBefore (css_style, doc.head.firstElementChild);
    }
    else
      doc.head.appendChild (css_style);

    return css_style;
  }
}

/********************************************************************
                         Style mamangent
*********************************************************************/

/**
 *  Modifies CSS styleSheets.
 *  <p>
 *  Modifies CSS style styleSheets. It can be preempted
 *  by css style inline modification (see vs.ui.View.setStyle).
 *  @see vs.ui.View#setStyles if you want to modify inline CSS.
 *
 *  @example
 *  vs.util.addCssRules ('.classname1', ['color: red', 'margin: 0px']);
 *
 * @memberOf vs.util
 * @function
 *
 * @param {String} selector CSS Selector
 * @param {Array} rules the array of rules
 */
function addCssRules (selector, rules)
{
  if (!isArray (rules)) { return; }

  var i = rules.length;
  while (i--)
  {
    addCssRule (selector, rules [i]);
  }
};

var __app_style_sheet__ = null;
/**
 *  Modifies CSS styleSheets.
 *  <p>
 *  Modifies CSS style styleSheets. It can be preempted
 *  by css style inline modification (see vs.ui.View.setStyle).
 *  @see vs.ui.View#setStyle if you want to modify inline CSS.
 *
 *  @example
 *  vs.util.addCssRule ('.classname1', 'color: red');
 *
 * @memberOf vs.util
 * @function
 *
 * @param {String} selector CSS Selector
 * @param {String} rule the rule using the following format:
 *   "prop_name: value"
 */
function addCssRule (selector, rule)
{
  if (!__app_style_sheet__)
  {
    var style = document.createElement ('style');
    /* For Safari */
    style.appendChild (document.createTextNode (''));
    head = document.getElementsByTagName ('head')[0];
    head.appendChild (style);

    __app_style_sheet__ =
      document.styleSheets[document.styleSheets.length - 1];
  }

  var l = 0;
  if (__app_style_sheet__.cssRules)
  {
    l = __app_style_sheet__.cssRules.length;
  } else if (__app_style_sheet__.rules)
  {
    l = __app_style_sheet__.rules.length;
  }

  if (__app_style_sheet__.insertRule)
  {
    __app_style_sheet__.insertRule (selector + ' {' + rule + '}', l);
  } else if (__app_style_sheet__.addRule)
  {
    __app_style_sheet__.addRule (selector, rule, l);
  }
};


/**
 * @private
 */
var SET_STYLE_OPTIMIZATION = true;

// /**
//  *  Sets the active stylesheet for the HTML document according to the specified
//  *  title.
//  *
//  *  @memberOf vs.util
//  *
//  * @param {String} title
//  */
// var setActiveStyleSheet = function (title)
// {
//   var i = 0, stylesheets = document.getElementsByTagName ("link"),
//     stylesheet, info, id, app, size;

//   var apps = vs.Application_applications;

//   if (SET_STYLE_OPTIMIZATION)
//   {
//     if (apps) for (id in apps)
//     {
//       app = apps [id];
//       if (app.view) app.view.style.display = "none";
//     }
//   }

//   for (i = 0; i < stylesheets.length; i++)
//   {
//     stylesheet = stylesheets [i];
//     // If the stylesheet doesn't contain the title attribute, assume it's
//     // a persistent stylesheet and should not be disabled
//     if (!stylesheet.getAttribute ("title")) { continue; }
//     // All other stylesheets than the one specified by "title" should be
//     // disabled
//     if (stylesheet.getAttribute ("title") !== title)
//     {
//       stylesheet.setAttribute ("disabled", true);
//     } else
//     {
//       stylesheet.removeAttribute ("disabled");
//     }
//   }

//   if (SET_STYLE_OPTIMIZATION)
//   {
//     if (apps) for (id in apps)
//     {
//       app = apps [id];
//       if (app.view) app.view.style.display = "block";
//     }
//   }
// }

// /**
//  *  Preload GUI HTML template for the given component.
//  *  <p>
//  *  When the developer uses createAndAddComponent method, the system will
//  *  load the HTML GUI template associated to the component to create.
//  *  This process can take times.<br>
//  *  In order to minimize the latency, this class method allows to preload all
//  *  data related to a component.<br>
//  *  This method should ne call when the application start.
//  *
//  *  @example
//  *  vs.util.preloadTemplate ('GUICompOne');
//  *  vs.util.preloadTemplate ('GUICompTwo');
//  *  ...
//  *  myObject.createAndAddComponent ('GUICompOne', conf, 'children');
//  *
//  *  @memberOf vs.util
//  *
//  * @param {String} comp_name The GUI component name
//  */
// function preloadTemplate (comp_name)
// {
//   var path = comp_name + '.xhtml', xmlRequest;

//   if (vs.ui && vs.ui.View && vs.ui.View.__comp_templates [path]) { return; }

//   xmlRequest = new XMLHttpRequest ();
//   xmlRequest.open ("GET", path, false);
//   xmlRequest.send (null);

//   if (xmlRequest.readyState === 4)
//   {
//     if (xmlRequest.status === 200 || xmlRequest.status === 0)
//     {
//       data = xmlRequest.responseText;
//       if (vs.ui && vs.ui.View) vs.ui.View.__comp_templates [path] = data;
//     }
//     else
//     {
//       console.error
//         ("Template file for component '" + comp_name + "' unfound");
//       return;
//     }
//   }
//   else
//   {
//     console.error
//       ("Pb when load the component '" + comp_name + "' template");
//     return;
//   }
//   xmlRequest = null;
// }

const defineProperty =
  (Object.defineProperty)? _defineProperty_api2 : _defineProperty_api1;

const getBoundingClientRect =
  (vsTestElem && vsTestElem.getBoundingClientRect) ?
  _getBoundingClientRect_api2: _getBoundingClientRect_api1;

/********************************************************************
                         export
*********************************************************************/

export {
  vsTestElem,
  vsTestStyle,
  clearImmediate,
  setImmediate,
  requestAnimationFrame,
  cancelRequestAnimationFrame,

  CSS_VENDOR,
  SUPPORT_3D_TRANSFORM,
  SUPPORT_CSS_TRANSFORM,

  // Class functions
  extendClass,
  defineProperty,
  defineClassProperty,
  defineClassProperties,
  free,
  extend,

  // element class
  hasClassName,
  addClassName,
  removeClassName,
  toggleClassName,

  // element style
  addCssRule,
  addCssRules,
  getElementHeight,
  getElementWidth,
  getElementDimensions,
  getElementStyle,
  setElementStyle,
  setElementOpacity,
  getElementOpacity,
  getElementAbsolutePosition,
  setElementPos,
  setElementSize,
  setElementVisibility,
  isElementVisible,
  removeAllElementChild,
  safeInnerHTML,
  setElementInnerText,
  setElementTransform,
  getElementTransform,
  getElementMatrixTransform,
  setElementTransformOrigin,
  getBoundingClientRect,

  // // other
  importFile,
  // setActiveStyleSheet,
  // preloadTemplate,
  // _defineProperty_api1, // export only for testing purpose
  // _defineProperty_api2, // export only for testing purpose
  // _extend_api1, // export only for testing purpose
  // _extend_api2 // export only for testing purpose
};
