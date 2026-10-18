/**
 *  Normalizes an unknown thrown value into an Error instance. <p/>
 *  Useful in `catch` blocks, where the caught value is typed `unknown`
 *  and may be anything (a string, an object, `undefined`...).
 *
 *  - If the value is already an Error (or a subclass), it is returned as is,
 *    preserving its message, stack and type.
 *  - Otherwise a new Error is created, using `String(error)` as message.
 *
 * @example
 *  try {
 *    doSomething();
 *  } catch (e) {
 *    console.error(asError(e).message);
 *  }
 *
 * @param {unknown} error The caught value to convert.
 * @return {Error} An Error instance.
 */
export const asError =(error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  }
  return new Error(String(error));
};
