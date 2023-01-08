/**
 *  Dimension is a (width, height) coordinate pair.
 *  When you use a Dimension object in matrix operations, the object is
 *  treated as a vector of the following form <x, y, 1>
 *
 * @param {Number} the x-coordinate value.
 * @param {Number} the y-coordinate value.
 */
export default class Dimension {
  constructor(public width: number, public height: number) {
  }
}
