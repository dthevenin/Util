// @ts-ignore
import parseFunction from 'parse-function';
import { ConstructorType, Func } from './types';

const app = parseFunction({
  ecmaVersion: 2019
});

export class Token<T= any> {
  id: Symbol;
  cast: Func<T, unknown>;

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
  private dependencies = new Map<Token, unknown>();
  private classes = new Map<Token, ConstructorType>();
  private factories = new Map<Token, Func<void>>();

  registerValue(token: Token, dependency: unknown): void {
    this.dependencies.set(token, dependency);
  }

  registerClass(token: Token, factory: ConstructorType): void {
    this.classes.set(token, factory);
  }

  registerFactory(token: Token, func: Func<void>): void {
    this.factories.set(token, func);
  }

  has(token: Token): boolean {
    return this.dependencies.has(token);
  }

  get<T>(token: Token<T>): T {
    if (!token) {
      throw new Error('Undefined token');
    }
    let obj = this.dependencies.get(token);
    if (!obj) {
      if (this.factories.has(token)) {
        const func = this.factories.get(token);
        this.dependencies.set(token, func && this.injectFunction(func));
      } else if (this.classes.has(token)) {
        const factory = this.classes.get(token);
        this.dependencies.set(token, factory && this.injectClass(factory));
        obj = this.dependencies.get(token);
      }

      if (!obj) {
        throw new Error(`Cannot find module '${token.toString()}'`);
      }
    }

    return obj as unknown as T;
  }

  private getParams(func: Func<void> | ConstructorType): unknown[] {
    return app.parse(func).args.map((dependency: Token<unknown>) => this.get(dependency));
  }

  private injectFunction(func: Func<void>) {
    const fnArgs = this.getParams(func);
    // eslint-disable-next-line prefer-spread
    return func.apply(null, fnArgs);
  }

  private injectClass(factory: ConstructorType) {
    const fnArgs = this.getParams(factory);

    // es1int-disable-next-line prefer-spread
    const F = factory.bind.apply(factory, fnArgs);

    return new F();
  }
}
