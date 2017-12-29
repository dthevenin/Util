const assert = require('assert');

import {
  isElement,
  isArray,
  isFunction,
  isString,
  isNumber,
  isObject,
  isUndefined
} from '../../../src/utils/is';


describe('IS test helpers', function () {
  describe('#isArray()', function () {
    // var node = document.createElement ('div');
    
    assert.equal(true, isArray([]));
    assert.equal(true, isArray([0]));
    assert.equal(true, isArray([0, 1]));
    assert.equal(false, isArray({}));
    // assert.equal(false, isArray(node.childNodes));
    assert.equal(false, isArray());
    assert.equal(false, isArray(''));
    assert.equal(false, isArray('foo'));
    assert.equal(false, isArray(0));
    assert.equal(false, isArray(1));
    assert.equal(false, isArray(null));
    assert.equal(false, isArray(true));
    assert.equal(false, isArray(false));
    assert.equal(false, isArray(undefined));
  });


  // describe('#isElement()', function () {
  //   var node = document.createElement('div');
  //   assert.equal(true, isElement(node));
  //   assert.equal(false, isElement(document.createTextNode('bla')));

  //   // falsy variables should not mess up return value type
  //   this.assert.equal(false, isElement(0));
  //   this.assert.equal(false, isElement(''));
  //   this.assert.equal(false, isElement(NaN));
  //   this.assert.equal(false, isElement(null));
  //   this.assert.equal(false, isElement(undefined));
  // });

  describe('#isFunction()', function () {
    // var node = document.createElement ('div');
    
    assert.equal(true, isFunction(function() { }));
    assert.equal(false, isFunction("a string"));
    // assert.equal(false, isFunction(node));
    assert.equal(false, isFunction([]));
    assert.equal(false, isFunction({}));
    assert.equal(false, isFunction(0));
    assert.equal(false, isFunction(false));
    assert.equal(false, isFunction(undefined));
  });

  describe('#isString()', function () {
    assert.equal(true, !isString(function() { }));
    assert.equal(true, isString("a string"));
    assert.equal(true, isString(new String("a string")));
    assert.equal(true, !isString(0));
    assert.equal(true, !isString([]));
    assert.equal(true, !isString({}));
    assert.equal(true, !isString(false));
    assert.equal(true, !isString(undefined));
  });

  describe('#isNumber()', function () {
    assert.equal(true, isNumber(0));
    assert.equal(true, isNumber(1.0));
    assert.equal(true, isNumber(new Number(0)));
    assert.equal(true, isNumber(new Number(1.0)));
    assert.equal(false, isNumber(function() { }));
    assert.equal(false, isNumber({ test: function() { return 3 } }));
    assert.equal(false, isNumber("a string"));
    assert.equal(false, isNumber([]));
    assert.equal(false, isNumber({}));
    assert.equal(false, isNumber(false));
    assert.equal(false, isNumber(undefined));
  });

  describe('#isObject()', function () {
    assert.equal(false, isObject(0));
    assert.equal(false, isObject(1.0));
    assert.equal(false, isObject(new Number(0)));
    assert.equal(false, isObject(new Number(1.0)));
    assert.equal(false, isObject(function() { }));
    assert.equal(true, isObject({ test: function() { return 3 } }));
    assert.equal(false, isObject("a string"));
    assert.equal(false, isObject([]));
    assert.equal(true, isObject({}));
    assert.equal(false, isObject(false));
    assert.equal(false, isObject(undefined));
  });

  describe('#isUndefined()', function () {
    assert.equal(true, isUndefined(undefined));
    assert.equal(false, isUndefined(null));
    assert.equal(false, isUndefined(false));
    assert.equal(false, isUndefined(0));
    assert.equal(false, isUndefined(""));
    assert.equal(false, isUndefined(function() { }));
    assert.equal(false, isUndefined([]));
    assert.equal(false, isUndefined({}));
  });
});
