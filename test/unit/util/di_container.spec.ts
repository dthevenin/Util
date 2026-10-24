import assert from 'assert';

import { DIContainer, injectionToken } from '../../../src/utils/di_container';

describe('DIContainer', function () {
  let container: DIContainer;

  beforeEach(function () {
    container = new DIContainer();
  });

  it('should give a registered value', function () {
    const token = injectionToken<{ name: string }>('test-value');
    const value = { name: 'value' };
    container.registerValue(token, value);
    assert.strictEqual(container.get(token), value);
  });

  it('should give the value of a factory from the first call, and cache it', function () {
    const token = injectionToken<{ n: number }>('test-factory');
    let calls = 0;
    container.registerFactory(token, () => ({ n: ++calls }));

    const first = container.get(token);
    assert.deepStrictEqual(first, { n: 1 });
    assert.strictEqual(container.get(token), first);
    assert.strictEqual(calls, 1);
  });

  it('should give an instance of a registered class, and cache it', function () {
    class Service {}
    const token = injectionToken<Service>('test-class');
    container.registerClass(token, Service);

    const first = container.get(token);
    assert.ok(first instanceof Service);
    assert.strictEqual(container.get(token), first);
  });

  it('should throw for a token which is not registered', function () {
    assert.throws(() => container.get(injectionToken('test-unknown')), /Cannot find module/);
  });

  it('should throw for an undefined token', function () {
    assert.throws(() => container.get(undefined as any), /Undefined token/);
  });
});
