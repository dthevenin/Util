import { isFloat32Array } from "./is";

type ArrayT = Array<any> | Float32Array | number;

export function arrayDeepClone<T extends ArrayT>(data: T): T {
  let result:ArrayT;

  if (isFloat32Array(data)) {
    result = new Float32Array(data.length);
    result.set(data);
  } else if (Array.isArray(data)) {
    const len = data.length
    result = new Array(len);

    for (let i = 0; i < len; i++) {
      result[i] = arrayDeepClone(data[i]);
    }
  } else result = data;

  return result as T;
}

export function arrayRemove<T>(array: Array<T>, entry: T): Array<T> {
  const idx = array?.indexOf(entry);
  if (idx >= 0) {
    array.splice(idx, 1);
  }
  return array;
}
