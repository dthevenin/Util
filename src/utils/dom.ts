import Point from './point';
import {
  isArray,
  isNumber,
  isString,
  isUndefined
} from './is';
import Dimension from './dimension';
import Matrix from './matrix';

/********************************************************************

*********************************************************************/

var document = (typeof window != "undefined")?window.document:null;

/**
 *  Returns the height of `element`.<br/>
 *
 *  This method returns correct values on elements whose display is set to
 *  `none` either in an inline style rule or in an CSS stylesheet.
 *
 *
 * @param {Element} elem The element
 *	@returns {Number} the height
 **/
export const getElementHeight = (elem: HTMLElement): number => getElementDimensions(elem).height;

/**
 *  Returns the width of `element`.<br/>
 *
 *  This method returns correct values on elements whose display is set to
 *  `none` either in an inline style rule or in an CSS stylesheet.
 *
 *
 * @param {Element} elem The element
 *	@returns {Number} the width
 **/
export const getElementWidth = (elem: HTMLElement): number => getElementDimensions (elem).width;

/**
 *  Finds the computed width and height of `element` and returns them as
 *  key/value pairs of an object.<br/>
 *  <p/>
 *  For backwards-compatibility, these dimensions represent the dimensions
 *  of the element's "border box" (including CSS padding and border).<br/> This
 *  is equivalent to the built-in `offsetWidth` and `offsetHeight`
 *  browser properties.
 *
 *
 * @param {Element} elem The element
 *	@returns {Object} the key/value width & height
 **/
function getElementDimensions(elem: HTMLElement): Dimension | undefined {
  const { height, width } = elem.getBoundingClientRect();
  return { height, width };
}

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
 * @param {Element} elem The element
 * @param {String} key The property style to find
 *	@returns {Object} the key/value width & height
 **/
function getElementStyle(elem: HTMLElement, key: string): string | number | null {
  key = key === 'float' ? 'cssFloat' : key;
  let value = elem.style.getPropertyValue(key);
  if (!value || value === 'auto') {
    const css = document.defaultView.getComputedStyle(elem, null);
    value = css?.getPropertyValue(key);
  }
  if (key === 'opacity') {
    return value ? parseFloat(value) : 1.0;
  }
  return value === 'auto' ? null : value;
}

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
 *
 * @param {Element} elem The element
 * @param styles
 */
export function setElementStyle(elem: HTMLElement, styles: Record<string, number | string | null | undefined>) {
  const elementStyle = elem.style;

  for (const [property, value] of Object.entries(styles)) {
    if (property === 'opacity') {
      setElementOpacity(
        elem, isNumber(value) ? value : parseFloat(value));
    } else {
      if (value === null || value === undefined) {
        elementStyle.removeProperty(property);
      } else {
        elementStyle.setProperty(property, isString(value) ? value: `${value}`);
      }
    }
  }
}

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
 * @param {Element} elem The element
 * @param {Number} value The opacity
 **/
export function setElementOpacity(elem: HTMLElement, value: number | undefined) {
  const elementStyle = elem.style;

  if (isUndefined(value)) {
    elementStyle.removeProperty ('opacity');
  } else {
    elementStyle.opacity =
      value > 1 ? '1' :
      value < 0.00001 ? '0' :
      value.toString();
  }
}

/**
 *  Returns the opacity of the element.
 *
 * @param {Element} elem The element
 * @return {Number} value The opacity
 **/
export const getElementOpacity = (elem: HTMLElement): number => getElementStyle(elem, 'opacity') as number;

/**
 * Compute the elements position in terms of the window viewport
 * Returns a vs.Point {x, y}
 *
 * @return Point the x,y absolute position of an element
 **/
export function getElementAbsolutePosition(elem: HTMLElement, force = false): Point {
  if (!force && elem.getBoundingClientRect) {
    const rec = elem.getBoundingClientRect ();
    if (rec) {
      return new Point(rec.left, rec.top);
    }
  }
  throw new Error('getElementAbsolutePosition Polyfill not implemented');
}

/**
 *  Set the absolute element position.
 *
 * @param {Element} elem The element
 * @param {Number} x The element left position
 * @param {Number} y The element top position
 **/
export function setElementPos(elem: HTMLElement, x: number, y: number) {
  var elementStyle = elem.style;

  elementStyle.left = x + 'px';
  elementStyle.top = y + 'px';
}

/**
 * Set the element size
 *
 * @param {Element} elem The element
 * @param {Number} w The element width
 * @param {Number} h The element height
 **/
export function setElementSize(elem: HTMLElement, w: number, h: number) {
  var elementStyle = elem.style;

  elementStyle.width = w + 'px';
  elementStyle.height = h + 'px';
}

/**
 *  Set the element HTML visibility
 *
 *
 * @param {Element} elem The element
 * @param {boolean} v True if the element should be visible or false
 **/
export function setElementVisibility(elem: HTMLElement, v: boolean) {
  var elementStyle = elem.style;

  if (elementStyle || isString(elem.innerHTML)) {
    elementStyle.visibility = v ? 'visible' : 'hidden';
  }
//  else if (elem instanceof CharacterData)
//  {}
  else { // SVG // TODO SVG case to improve?
    elem.setAttribute ('visibility', v ? 'visible' : 'hidden');
  }
}

/**
 *  Return true if the element is visible, false otherwise
 *
 * @param {Element} elem The element
 * @return {boolean}
 **/
export function isElementVisible(elem: HTMLElement): boolean {
  if (!elem) { return false; }
  var elementStyle = elem.style;

  if (elementStyle || isString (elem.innerHTML)) {
    return elementStyle.visibility !== 'hidden'
  }
  else if (elem instanceof CharacterData) {
    return true;
  } else {// SVG // TODO to improve
    return elem.getAttribute ('visibility') !== 'hidden'
  }
}

/**
 *  Remove all element children
 *
 * @param {Element} elem The element
 **/
export function removeAllElementChild(elem: HTMLElement) {
  if (!elem.childNodes) return;

  let l = elem.childNodes.length;
  while (l--) {
    elem.removeChild (elem.firstChild);
  }
}

export function setElementTransform(elem: HTMLElement, transform: string) {
  if (elem && elem.style) elem.style.transform = transform;
  else console.warn ("setElementTransform, elem null or without style");
}

/**
 *@private
 */
export const getElementTransform = (elem: HTMLElement): string | undefined => elem?.style?.transform;

/**
 *  get the Matrix transformation to a element
 *
 * @param {Element} elem The element
 * @return {Matrix} matrix3d css transformation
 **/
export function getElementMatrixTransform(elem: HTMLElement): Matrix | null {
  const css = document.defaultView.getComputedStyle (elem, null);
  return css.transform ? new Matrix(css.transform) : null;
}

/**
 *  Set the CSS transformation to an element
 *
 * @param {Element} elem The element
 * @param {String} value. The value is a CSS string. Ex: '50% 0%' or '10px 10px'
 **/
export function setElementTransformOrigin(elem: HTMLElement, value: string) {
  elem.style.transformOrigin = value;
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
 * @param {String} selector CSS Selector
 * @param {Array} rules the array of rules
 */
export function addCssRules (selector: string, rules: string[]) {
  if (!isArray (rules)) return;
  rules.forEach(rule => addCssRule (selector, rule));
}

let appStyleSheet: CSSStyleSheet = null;
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
 * @param {String} selector CSS Selector
 * @param {String} rule the rule using the following format:
 *   "prop_name: value"
 */
export function addCssRule (selector: string, rule: string) {
  if (!appStyleSheet) {
    const style = document.createElement ('style');
    /* For Safari */
    style.appendChild(document.createTextNode (''));
    const head = document.getElementsByTagName ('head')[0];
    head.appendChild (style);

    appStyleSheet = document.styleSheets[document.styleSheets.length - 1];
  }

  const l = appStyleSheet.cssRules.length;
  appStyleSheet.insertRule (selector + ' {' + rule + '}', l);
}


export const getBoundingClientRect = (elem: HTMLElement): DOMRect => elem.getBoundingClientRect();
