import assert from 'assert';

import { asError } from '../../../src/utils/errors';

describe('asError', function () {
  it('should return the same Error instance', function () {
    const error = new Error('boom');
    assert.strictEqual(asError(error), error);
  });

  it('should preserve Error subclasses', function () {
    const error = new TypeError('bad type');
    const result = asError(error);
    assert.strictEqual(result, error);
    assert.ok(result instanceof TypeError);
  });

  it('should wrap a string', function () {
    const result = asError('boom');
    assert.ok(result instanceof Error);
    assert.strictEqual(result.message, 'boom');
  });

  it('should wrap a number', function () {
    assert.strictEqual(asError(42).message, '42');
  });

  it('should wrap undefined and null', function () {
    assert.strictEqual(asError(undefined).message, 'undefined');
    assert.strictEqual(asError(null).message, 'null');
  });

  it('should wrap a plain object', function () {
    const result = asError({ code: 42 });
    assert.ok(result instanceof Error);
    assert.strictEqual(result.message, '[object Object]');
  });

  it('should use the toString of an object', function () {
    const value = { toString: () => 'custom' };
    assert.strictEqual(asError(value).message, 'custom');
  });
});
