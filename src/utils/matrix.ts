/**
 * Represents a 4×4 homogeneous matrix that enables Document Object Model (DOM)
 * scripting access to Cascading Style Sheets (CSS) 2-D and 3-D Transforms
 * functionality.
 */
export default class Matrix extends DOMMatrix {
  private precision = 1000;

  /**
   *  Matrix#isAffine() -> Boolean
   *
   *  Determines whether the matrix is affine.
   **/
  isAffine () {
    return !(this.m13 || this.m14 || this.m23 || this.m24 || this.m31 ||
      this.m32 || this.m33 !== 1 && this.m34 || this.m43 || this.m44 !== 1);
  }

  /**
   *  Matrix#getMatrixStr() -> String
   *  return affine transformation matrix
   *
   *  Returns a string representation of the 3d matrix.
   **/
  getMatrixStr() {
    const points = [
      ~~(this.a * this.precision) / this.precision,
      ~~(this.b * this.precision) / this.precision,
      ~~(this.c * this.precision) / this.precision,
      ~~(this.d * this.precision) / this.precision,
      ~~(this.e * this.precision) / this.precision,
      ~~(this.f * this.precision) / this.precision
    ];
    return `matrix3d(${points.join(', ')})`;
  }

  /**
   *  Matrix#getMatrix3dStr() -> String
   *
   *  Returns a string representation of the 3d matrix.
   **/
  getMatrix3dStr() {
    const points = [
      ~~(this.m11 * this.precision) / this.precision,
      ~~(this.m12 * this.precision) / this.precision,
      ~~(this.m13 * this.precision) / this.precision,
      ~~(this.m14 * this.precision) / this.precision,
      ~~(this.m21 * this.precision) / this.precision,
      ~~(this.m22 * this.precision) / this.precision,
      ~~(this.m23 * this.precision) / this.precision,
      ~~(this.m24 * this.precision) / this.precision,
      ~~(this.m31 * this.precision) / this.precision,
      ~~(this.m32 * this.precision) / this.precision,
      ~~(this.m33 * this.precision) / this.precision,
      ~~(this.m34 * this.precision) / this.precision,
      ~~(this.m41 * this.precision) / this.precision,
      ~~(this.m42 * this.precision) / this.precision,
      ~~(this.m43 * this.precision) / this.precision,
      ~~(this.m44 * this.precision) / this.precision
    ];
    return `matrix3d(${points.join(', ')})`;
  }
}
