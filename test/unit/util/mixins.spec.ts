import assert from 'assert';

import { applyMixins, Mixin, SupportMixins } from '../../../src/utils/mixins';

const log: [string, unknown][] = [];

class Greeter extends Mixin {
  protected override initMixin(): void { log.push(['greeter init', this]); }
  protected override releaseMixin(): void { log.push(['greeter release', this]); }
  greet(): string { return 'hello'; }
}

class Counter extends Mixin {
  protected override initMixin(): void { log.push(['counter init', this]); }
  protected override releaseMixin(): void { log.push(['counter release', this]); }
  count(): number { return 42; }
}

class Target extends SupportMixins {}
// the copied methods (the protected hooks of both mixins would conflict)
interface Target {
  greet(): string;
  count(): number;
}
applyMixins(Target, [Greeter, Counter]);

class SubTarget extends Target {}
applyMixins(SubTarget, []);

describe('mixins', function () {
  beforeEach(function () {
    log.length = 0;
  });

  it('should copy the mixins methods', function () {
    const target = new Target();
    assert.strictEqual(target.greet(), 'hello');
    assert.strictEqual(target.count(), 42);
  });

  it('should call every initMixin with the instance', function () {
    const target = new Target();
    assert.deepStrictEqual(log, [['greeter init', target], ['counter init', target]]);
  });

  it('should call every releaseMixin with the instance', function () {
    const target = new Target();
    log.length = 0;

    target.release();
    assert.deepStrictEqual(log, [['greeter release', target], ['counter release', target]]);
  });

  it('should keep the hooks inherited from a parent class', function () {
    const target = new SubTarget();
    target.release();
    assert.deepStrictEqual(log.map(([name]) => name),
      ['greeter init', 'counter init', 'greeter release', 'counter release']);
  });

  it('should support a class without mixins', function () {
    class Plain extends SupportMixins {}
    assert.doesNotThrow(() => new Plain().release());
  });
});
