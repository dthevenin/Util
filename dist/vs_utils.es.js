const STRING_CLASS = "[object String]";

const _toString = Object.prototype.toString;
const isElement = (object) => object?.nodeType === 1;
const isArray = Array.isArray;
const isFunction = (object) => typeof object === "function";
const isString = (object) => _toString.call(object) === STRING_CLASS;
const isNumber = (object) => typeof object === "number" && isFinite(object) || object instanceof Number;
function isObject(object) {
  try {
    return Object.getPrototypeOf(object) === Object.prototype;
  } catch (e) {
    return false;
  }
}
const isUndefined = (object) => typeof object === "undefined";
const isDate = (object) => object instanceof Date;

const __date_reg_exp = /\/Date\((-?\d+)\)\//;
const htmlEncode = (str) => str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const strip = (str) => str.replace(/^\s+/, "").replace(/\s+$/, "");
function camelize(str) {
  var parts = str.split("-"), len = parts.length;
  if (len === 1) {
    return parts[0];
  }
  var camelized = str.charAt(0) === "-" ? parts[0].charAt(0).toUpperCase() + parts[0].substring(1) : parts[0];
  for (var i = 1; i < len; i++)
    camelized += parts[i].charAt(0).toUpperCase() + parts[i].substring(1);
  return camelized;
}
const capitalize = (str) => str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
const underscore = (str) => str.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/-/g, "_").toLowerCase();
function parseJSON(json) {
  if (!json)
    return null;
  var temp = JSON.parse(json);
  if (!__date_reg_exp.test(json))
    return temp;
  function manageDate(obj) {
    if (isString(obj)) {
      const result = __date_reg_exp.exec(obj);
      if (result && result[1]) {
        obj = new Date(parseInt(result[1]));
      }
    } else if (isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
        obj[i] = manageDate(obj[i]);
      }
    } else if (isDate(obj)) {
      return obj;
    } else if (isObject(obj)) {
      for (var key in obj) {
        obj[key] = manageDate(obj[key]);
      }
    }
    return obj;
  }
  return manageDate(temp);
}

function arrayDeepClone(data) {
  let result;
  if (data instanceof window.Float32Array) {
    result = new Float32Array(data.length);
    result.set(data);
  } else if (data instanceof Array) {
    const len = data.length;
    result = new Array(len);
    for (let i = 0; i < len; i++) {
      result[i] = arrayDeepClone(data[i]);
    }
  } else
    result = data;
  return result;
}
function arrayRemove(array, entry) {
  const idx = array?.indexOf(entry);
  if (idx >= -1) {
    array.splice(idx, 1);
  }
  return array;
}

function importFile(path, type, clb = void 0, doc = document, first = false) {
  if (type === "js") {
    const jsEffects = doc.createElement("script");
    jsEffects.setAttribute("type", "text/javascript");
    jsEffects.setAttribute("src", path);
    if (isFunction(clb)) {
      jsEffects.onload = () => clb.call(this, path);
    }
    const head = doc.head ?? doc.querySelector("head");
    if (first && doc.head.firstElementChild) {
      head.insertBefore(jsEffects, head.firstElementChild);
    } else {
      head.appendChild(jsEffects);
    }
  } else {
    const cssStyle = doc.createElement("link");
    cssStyle.setAttribute("rel", "stylesheet");
    cssStyle.setAttribute("type", "text/css");
    cssStyle.setAttribute("href", path);
    cssStyle.setAttribute("media", "screen");
    if (isFunction(clb)) {
      var count = 0;
      (function() {
        if (!cssStyle.sheet) {
          if (count++ < 100) {
            setTimeout(arguments.callee, 100);
          } else {
            console.error("CSS load of " + path + " failed!");
          }
          return;
        }
        clb.call(document, path);
      })();
    }
    const head = doc.head ?? doc.querySelector("head");
    if (first && doc.head.firstElementChild) {
      head.insertBefore(cssStyle, head.firstElementChild);
    } else {
      head.appendChild(cssStyle);
    }
  }
}

const isPowerOfTwo = (x) => x !== 0 && (x & x - 1) === 0;

export { arrayDeepClone, arrayRemove, camelize, capitalize, htmlEncode, importFile, isArray, isDate, isElement, isFunction, isNumber, isObject, isPowerOfTwo, isString, isUndefined, parseJSON, strip, underscore };
//# sourceMappingURL=vs_utils.es.js.map
