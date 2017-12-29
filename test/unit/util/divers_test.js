const assert = require('assert');


import { toJSON, clone } from '../../../src/utils/helpers';
import { isUndefined } from '../../../src/utils/is';

describe('Helpers tests', function () {
  describe('#clone()', function () {
    var object = {foo: 'foo', bar: [1, 2, 3]};
    
    it('should clone null', () => assert.strictEqual(null, clone(null)));
    it('should clone undefined', () => {
      assert.strictEqual(true, isUndefined (clone(undefined)));
      assert.strictEqual(true, isUndefined(clone()));
    });
    it('should clone a string', () => assert.strictEqual("test", clone("test")));
    it('should clone object', () => {
      assert.deepStrictEqual(object, clone(object));    
      var newObj = clone(object);
      delete newObj.bar;
      assert.deepStrictEqual({ foo: 'foo' }, newObj);
    });
  });

  describe('#toJSON()', function () {
    var object = {};
    it('should return undefined', () => {
      assert.strictEqual(true, isUndefined(toJSON(undefined)));
      assert.strictEqual(true, isUndefined(toJSON(object.K)));
    });
    it('should return a string', () => {
      assert.strictEqual('\"\"', toJSON(''));
      assert.strictEqual('\"test\"', toJSON('test'));
    });
    it('should manage NaN', () => assert.strictEqual('null', toJSON(Number.NaN)));
    it('should manage number', () => assert.strictEqual('0', toJSON(0)));
    it('should manage negative number', () => assert.strictEqual('-293', toJSON(-293)));
    it('should manage arrays', () => {
      assert.strictEqual('[]', toJSON([]));
      assert.strictEqual('[\"a\"]', toJSON(['a']));
      assert.strictEqual('[\"a\",1]', toJSON(['a', 1]));
    });
    it('should manage objects', () => {
      assert.strictEqual('[\"a\",{\"b\":null}]', toJSON(['a', {'b': null}]));
      assert.strictEqual('{\"a\":\"hello!\"}', toJSON({a: 'hello!'}));
      assert.strictEqual('{}', toJSON({}));
      assert.strictEqual('{}', toJSON({ a: undefined, b: undefined, c: object.K}));
      assert.strictEqual('{\"b\":[null,false,true,null],\"c\":{\"a\":\"hello!\"}}',
        toJSON({'b': [undefined, false, true, undefined], c: {a: 'hello!'}}));
    });
    it('should manage true', () => assert.strictEqual('true', toJSON(true)));
    it('should manage false', () => assert.strictEqual('false', toJSON(false)));
    it('should manage null', () => assert.strictEqual('null', toJSON(null)));
    // var element = document.createElement ('div');
    // element.toJSON = function(){return 'I\'m a div with id test'};
    
    // // marche pas
    // assertEquals ('ObjectToJSON 19', '"I\'m a div with id test"', toJSON(element));
  });
});


