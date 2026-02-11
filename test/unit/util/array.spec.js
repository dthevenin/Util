import assert from 'assert';

import { arrayDeepClone, arrayRemove } from '../../../dist/vs_utils.es.js';

describe('arrayDeepClone', function () {
  it('should clone an empty array', function () {
    const result = arrayDeepClone([]);
    assert.deepStrictEqual(result, []);
  });

  it('should clone a flat array', function () {
    const src = [1, 2, 3];
    const result = arrayDeepClone(src);
    assert.deepStrictEqual(result, [1, 2, 3]);
    assert.notStrictEqual(result, src);
  });

  it('should deep clone nested arrays', function () {
    const inner = [4, 5];
    const src = [1, [2, 3], inner];
    const result = arrayDeepClone(src);
    assert.deepStrictEqual(result, [1, [2, 3], [4, 5]]);
    assert.notStrictEqual(result[1], src[1]);
    assert.notStrictEqual(result[2], inner);
  });

  it('should clone a Float32Array', function () {
    const src = new Float32Array([1.5, 2.5, 3.5]);
    const result = arrayDeepClone(src);
    assert.ok(result instanceof Float32Array);
    assert.deepStrictEqual(Array.from(result), [1.5, 2.5, 3.5]);
    assert.notStrictEqual(result, src);
  });

  it('should return a number as-is', function () {
    assert.strictEqual(arrayDeepClone(42), 42);
    assert.strictEqual(arrayDeepClone(0), 0);
    assert.strictEqual(arrayDeepClone(-1), -1);
  });

  it('should deep clone arrays containing Float32Arrays', function () {
    const inner = new Float32Array([1.0, 2.0]);
    const src = [inner, [3]];
    const result = arrayDeepClone(src);
    assert.ok(result[0] instanceof Float32Array);
    assert.deepStrictEqual(Array.from(result[0]), [1.0, 2.0]);
    assert.notStrictEqual(result[0], inner);
  });
});

describe('arrayRemove', function () {
  it('should remove an existing entry', function () {
    const arr = ['a', 'b', 'c'];
    const result = arrayRemove(arr, 'b');
    assert.deepStrictEqual(result, ['a', 'c']);
    assert.strictEqual(result, arr);
  });

  it('should remove the first occurrence only', function () {
    const arr = [1, 2, 3, 2];
    arrayRemove(arr, 2);
    assert.deepStrictEqual(arr, [1, 3, 2]);
  });

  it('should return the same array when entry is not found', function () {
    const arr = [1, 2, 3];
    const result = arrayRemove(arr, 99);
    assert.deepStrictEqual(result, [1, 2, 3]);
    assert.strictEqual(result, arr);
  });

  it('should handle an empty array', function () {
    const arr = [];
    const result = arrayRemove(arr, 'x');
    assert.deepStrictEqual(result, []);
  });

  it('should remove object entries by reference', function () {
    const obj = { id: 1 };
    const arr = [obj, { id: 2 }];
    arrayRemove(arr, obj);
    assert.deepStrictEqual(arr, [{ id: 2 }]);
  });
});