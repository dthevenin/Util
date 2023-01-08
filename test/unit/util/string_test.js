const assert = require('assert');

import {
  camelize,
  capitalize,
  underscore,
  strip,
  htmlEncode,
  parseJSON
} from '../../../src/utils/string';

describe('String helpers', function () {
  describe('#camelize()', function () {
    it('should return empty strings', function () {
      assert.strictEqual('', camelize(''));
      assert.strictEqual('', camelize('-'));
    });

    it('should return camilized strings', function () {
      assert.strictEqual('foo', camelize('foo'));
      assert.strictEqual('foo_bar', camelize('foo_bar'));
      assert.strictEqual('FooBar', camelize('-foo-bar'));
      assert.strictEqual('FooBar', camelize('FooBar'));

      assert.strictEqual('fooBar', camelize('foo-bar'));
      assert.strictEqual('borderBottomWidth', camelize('border-bottom-width'));

      assert.strictEqual('classNameTest', camelize('class-name-test'));
      assert.strictEqual('classNameTest', camelize('className-test'));
      assert.strictEqual('classNameTest', camelize('class-nameTest'));
    });
  });

  describe('#capitalize()', function () {
    it('should return empty strings', function () {
      assert.strictEqual('', capitalize(''));
    });

    it('should return capitalized strings', function () {
      assert.strictEqual('', capitalize(''));
      assert.strictEqual('Ä', capitalize('ä'));
      assert.strictEqual('A', capitalize('A'));
      assert.strictEqual('Hello', capitalize('hello'));
      assert.strictEqual('Hello', capitalize('HELLO'));
      assert.strictEqual('Hello', capitalize('Hello'));
      assert.strictEqual('Hello world', capitalize('hello WORLD'));
    });
  });

  describe('#underscore()', function () {
    it('should return empty strings', function () {
      assert.strictEqual('', underscore(''));
    });

    it('should return capitalized strings', function () {
      assert.strictEqual('_', underscore('-'));
      assert.strictEqual('foo', underscore('foo'));
      assert.strictEqual('foo', underscore('Foo'));
      assert.strictEqual('foo_bar', underscore('foo_bar'));
      assert.strictEqual('border_bottom', underscore('borderBottom'));
      assert.strictEqual('border_bottom_width', underscore('borderBottomWidth'));
      assert.strictEqual('border_bottom_width', underscore('border-Bottom-Width'));
    });
  });

  describe('#strip()', function () {
    it('should return striped strings', function () {
      assert.strictEqual('hello world', strip('   hello world  '));
      assert.strictEqual('hello world', strip('hello world'));
      assert.strictEqual('hello  \n  world', strip('  hello  \n  world  '));
      assert.strictEqual('', strip(' '));
    });
  });

  describe('#htmlEncode()', function () {
    it('should return empty strings', function () {
      assert.strictEqual('', htmlEncode(''));
    });

    it('should return htmlEncodeed strings', function () {
      assert.strictEqual('test', htmlEncode('test'));
      assert.strictEqual("&lt;", htmlEncode('<'));
      assert.strictEqual("&gt;", htmlEncode('>'));
      assert.strictEqual("&lt;&gt;", htmlEncode('<>'));
      assert.strictEqual("&lt;!--&gt;", htmlEncode("<!-->"));
      assert.strictEqual("&amp;", htmlEncode('&'));
    });
  });

  describe('#parseJSON()', function () {
    const valid = '{"test": \n\r"hello world!"}';
    const invalid = '{"test": "hello world!"';
    const date = new Date(1326814228756);
    const date_str = '{"date":"/Date(1326814228756)/"}';
    const c_obj = {
      id: "hak_id_1326467971099169932",
      data: [{
        nb: 16,
        content: "Test",
        done: true,
      }]
    };

    const c_str = '{"id":"hak_id_1326467971099169932", "data": [{"nb":16,"content":"Test","done":true}]}';

    it('should return empty strings', function () {
      assert.strictEqual('', parseJSON('""'));
      assert.strictEqual('"', parseJSON('"\\""'));
    });

    it('should return null', function () {
      assert.strictEqual(null, parseJSON('null'));
    });

    it('should return a string', function () {
      assert.strictEqual('foo', parseJSON('"foo"'));
      assert.strictEqual('hello world!', parseJSON(valid).test);
    });
    
    it('should return empty array', function () {
      assert.deepStrictEqual([], parseJSON('[]'));
    });

    it('should return empty object', function () {
      assert.deepStrictEqual({}, parseJSON('{}'));
    });

    it('should return a number', function () {
      assert.strictEqual(123, parseJSON('123'));
    });

    it('should return boolean', function () {
      assert.strictEqual(true, parseJSON('true'));
      assert.strictEqual(false, parseJSON('false'));
    });

    it('should return a date', function () {
      assert.strictEqual(date.toString(), parseJSON(date_str).date.toString());
    });

    it('should return an object', function () {
      assert.deepStrictEqual(c_obj, parseJSON(c_str));
    });
  });
});
