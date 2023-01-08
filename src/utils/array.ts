type ArrayT = Array<any> | Float32Array | number;

export function arrayDeepClone<T extends ArrayT>(data: T): T {
  let result:ArrayT;

  if (data instanceof window.Float32Array) {
    result = new Float32Array (data.length);
    result.set(data);
  }  else if (data instanceof Array) {
    const len = data.length
    result = new Array (len);

    for (let i = 0; i < len; i++) {
      result [i] = arrayDeepClone(data [i]);
    }
  } else result = data;

  return result as T;
}

export function arrayRemove<T>(array: Array<T>, entry: T): Array<T> {
  const idx = array?.indexOf(entry);
  if (idx >= -1) {
    array.splice(idx, 1);
  }
  return array;
}
