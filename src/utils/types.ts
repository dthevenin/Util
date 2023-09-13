export type ConstructorType<T = {}> = new (...args: any[]) => T;
export type DestructorType = () => void;

export type Func<R, T1 = never, T2 = never, T3 = never, T4 = never, T5 = never> =
  (arg1?: T1, arg2?: T2, arg3?: T3, arg4?: T4, arg5?: T5) => R;

export const NULL_TYPE = 'Null';

export const UNDEFINED_TYPE = 'Undefined';

export const BOOLEAN_TYPE = 'Boolean';

export const NUMBER_TYPE = 'Number';

export const STRING_TYPE = 'String';

export const OBJECT_TYPE = 'Object';

export const BOOLEAN_CLASS = '[object Boolean]';

export const NUMBER_CLASS = '[object Number]';

export const STRING_CLASS = '[object String]';

export const ARRAY_CLASS = '[object Array]';

export const OBJECT_CLASS = '[object Object]';

export type NotNullableParameter = string | number | any [] | Record<any, any> | Map<any, any> | Set<any>;
