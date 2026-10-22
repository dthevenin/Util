type MixinHook = (this: SupportMixins) => void;

export class SupportMixins {
  constructor() {
    // @ts-ignore
    (this.__inits as MixinHook[] | undefined)?.forEach(f => f.call(this));
  }

  /**
   * Calls the releaseMixin() of the mixins, with this instance
   */
  release() {
    // @ts-ignore
    (this.__releases as MixinHook[] | undefined)?.forEach(f => f.call(this));
  }
}

export abstract class Mixin {
  protected initMixin(): void {}
  protected releaseMixin(): void {}
}

// This can live anywhere in your codebase:
export function applyMixins(derivedCtor: typeof SupportMixins, constructors: (typeof Mixin)[]): void {
  const proto = derivedCtor.prototype as { __inits?: MixinHook[], __releases?: MixinHook[] };

  // hooks lists of this class: created once (not per mixin), keeping the
  // hooks inherited from a parent class
  if (!Object.prototype.hasOwnProperty.call(proto, '__inits')) proto.__inits = [...(proto.__inits ?? [])];
  if (!Object.prototype.hasOwnProperty.call(proto, '__releases')) proto.__releases = [...(proto.__releases ?? [])];

  constructors.forEach(baseCtor => {
    // @ts-ignore
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      if (name === 'initMixin') {
        // @ts-ignore
        derivedCtor.prototype.__inits.push(baseCtor.prototype[name]);
      } else if (name === 'releaseMixin') {
        // @ts-ignore
        derivedCtor.prototype.__releases.push(baseCtor.prototype[name]);
      } else {
        Object.defineProperty(
          derivedCtor.prototype,
          name,
          Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
          Object.create(null)
        );
      }
    });
  });
}
