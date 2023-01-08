import Matrix from './matrix'

/**
 *  @class
 *  Point is an (x, y) coordinate pair.
 *  When you use a Point object in matrix operations, the object is
 *  treated as a vector of the following form <x, y, 1>
 *
 * @param {Number} the x-coordinate value.
 * @param {Number} the y-coordinate value.
 */
export default class Point {
  constructor(public x: number, public y: number, public z = 0) {
  }

  /**
   * Applies the given 2×3 matrix transformation on this Point object and
   * returns a new, transformed Point object.
   *
   * @name Point#matrixTransform
   * @function
   * @public
   * @param {Matrix} matrix he matrix
   * @returns {Point} the matrix
   */
  matrixTransform(matrix: Matrix): Point {
    let matrixTmp = new Matrix ();

    const transM = matrixTmp.translate(this.x, this.y, this.z ?? 0);
    const multiTransM = matrix.multiply(transM);

    return new Point (multiTransM.m41, multiTransM.m42);
  }
}
