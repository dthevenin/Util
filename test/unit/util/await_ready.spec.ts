import assert from 'assert';

import { AwaitReady } from '../../../src/utils/await_ready';

class Service extends AwaitReady {
  constructor(timeOut: number) {
    super(timeOut);
  }

  setReady() {
    this._isReady = true;
  }
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('AwaitReady', function () {
  it('should resolve at once when already ready', async function () {
    const service = new Service(1000);
    service.setReady();
    await service.awaitReady();
    assert.strictEqual(service.isReady, true);
  });

  it('should resolve when ready before the first check', async function () {
    const service = new Service(1000);
    setTimeout(() => service.setReady(), 50);
    await service.awaitReady();
  });

  it('should resolve when ready after the first check', async function () {
    const service = new Service(1500);
    setTimeout(() => service.setReady(), 450);

    const start = Date.now();
    await service.awaitReady();
    const elapsed = Date.now() - start;
    assert.ok(elapsed >= 450 && elapsed < 1000, `resolved after ${elapsed}ms`);
  });

  it('should resolve all the callers', async function () {
    const service = new Service(1500);
    setTimeout(() => service.setReady(), 450);
    await Promise.all([service.awaitReady(), service.awaitReady(), service.awaitReady()]);
  });

  it('should time out when never ready', async function () {
    const service = new Service(500);
    await assert.rejects(service.awaitReady(), (e: unknown) => e === 'Did time out');
  });

  it('should time out when ready after the time out', async function () {
    const service = new Service(300);
    setTimeout(() => service.setReady(), 600);
    await assert.rejects(service.awaitReady(), (e: unknown) => e === 'Did time out');
    await wait(400);
    assert.strictEqual(service.isReady, true);
  });

  describe('after a time out', function () {
    it('should reject a new caller at once', async function () {
      const service = new Service(300);
      await assert.rejects(service.awaitReady(), (e: unknown) => e === 'Did time out');

      const start = Date.now();
      await assert.rejects(service.awaitReady(), (e: unknown) => e === 'Did time out');
      const elapsed = Date.now() - start;
      assert.ok(elapsed < 50, `rejected after ${elapsed}ms`);
    });

    it('should reject the new callers, even once ready', async function () {
      const service = new Service(300);
      setTimeout(() => service.setReady(), 400);
      await assert.rejects(service.awaitReady(), (e: unknown) => e === 'Did time out');

      await wait(200);
      assert.strictEqual(service.isReady, true);
      await assert.rejects(service.awaitReady(), (e: unknown) => e === 'Did time out');
    });

    it('should not keep a caller waiting', async function () {
      const service = new Service(200);
      for (let i = 0; i < 3; i++) {
        await assert.rejects(service.awaitReady(), (e: unknown) => e === 'Did time out');
      }
    });
  });
});
