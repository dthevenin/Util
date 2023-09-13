import { ConstructorType } from "./types";

export class Token<T = any> {
  id: Symbol;
  cast: (param: unknown) => T;

  constructor(name: string) {
    this.id = Symbol.for(name);
    this.cast = (val: unknown) => val as T;
  }

  toString(): string {
    return this.id.toString();
  }
}

export const injectionToken = <T>(name: string): Token<T> => Object.freeze(new Token(name));

export class EmptyClass {}

export class DIContainer {
  #dependencies = new Map<Token, unknown>();
  #classes = new Map<Token, ConstructorType>();
  #factories = new Map<Token, () => void>();

  registerValue(token: Token, dependency: unknown): void {
    this.#dependencies.set(token, dependency);
  }

  registerClass(token: Token, factory: ConstructorType): void {
    this.#classes.set(token, factory);
  }

  registerFactory(token: Token, func: () => void): void {
    this.#factories.set(token, func);
  }

  has(token: Token): boolean {
    return this.#dependencies.has(token);
  }

  get<T>(token: Token<T>): T {
    if (!token) {
      throw new Error('Undefined token');
    }
    let obj = this.#dependencies.get(token);
    if (!obj) {
      if (this.#factories.has(token)) {
        const func = this.#factories.get(token);
        this.#dependencies.set(token, func && this.#injectFunction(func));
      } else if (this.#classes.has(token)) {
        const factory = this.#classes.get(token);
        this.#dependencies.set(token, factory && this.#injectClass(factory));
        obj = this.#dependencies.get(token);
      }

      if (!obj) {
        throw new Error(`Cannot find module '${token.toString()}'`);
      }
    }

    return obj as unknown as T;
  }

  #injectFunction(func: () => void) {
    return func.apply(null, []);
  }

  #injectClass(factory: ConstructorType) {
    const F = factory.bind.apply(factory, []);

    return new F();
  }
}
