export type ConstructorType<T = any> = new (...args: any[]) => T;

export type Func<R, T1 = never, T2 = never, T3 = never, T4 = never, T5 = never> =
  (arg1?: T1, arg2?: T2, arg3?: T3, arg4?: T4, arg5?: T5) => R;
