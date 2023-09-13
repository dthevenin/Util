export class SupportMixins {
  constructor() {
    // @ts-ignore
    this.__inits.forEach(f => f());
  }

  release() {
    // @ts-ignore
    this.__releases.forEach(f => f());
  }
}

export abstract class Mixin {
  protected initMixin(): void {}
  protected releaseMixin(): void {}
}

// This can live anywhere in your codebase:
export function applyMixins(derivedCtor: typeof SupportMixins, constructors: (typeof Mixin)[]): void {
  constructors.forEach(baseCtor => {
    // @ts-ignore
    derivedCtor.prototype.__inits = [];
    // @ts-ignore
    derivedCtor.prototype.__releases = [];
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
