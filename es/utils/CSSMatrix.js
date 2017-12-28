import FirminCSSMatrix from './FirminCSSMatrix';

/**
 * Represents a 4×4 homogeneous matrix that enables Document Object Model (DOM)
 * scripting access to Cascading Style Sheets (CSS) 2-D and 3-D Transforms
 * functionality.
 * @public
 * @memberOf vs
 */
const CSSMatrix = 'WebKitCSSMatrix' in window ? window.WebKitCSSMatrix : 'MSCSSMatrix' in window ? window.MSCSSMatrix : FirminCSSMatrix;

/**
 *  CSSMatrix#isAffine() -> Boolean
 *
 *  Determines whether the matrix is affine.
 **/
if (!CSSMatrix.prototype.isAffine) {
  CSSMatrix.prototype.isAffine = function () {
    return !(this.m13 || this.m14 || this.m23 || this.m24 || this.m31 || this.m32 || this.m33 !== 1 && this.m34 || this.m43 || this.m44 !== 1);
  };
}

var precision = 1000;

/**
 *  CSSMatrix#getMatrixStr() -> String
 *  return affine transformation matrix
 * @public
 * @function
 *
 *  Returns a string representation of the 3d matrix.
 **/
CSSMatrix.prototype.getMatrixStr = function () {
  var points = [~~(this.a * precision) / precision, ~~(this.b * precision) / precision, ~~(this.c * precision) / precision, ~~(this.d * precision) / precision, ~~(this.e * precision) / precision, ~~(this.f * precision) / precision];
  return "matrix(" + points.join(", ") + ")";
};

/**
 *  CSSMatrix#getMatrix3dStr() -> String
 * @public
 * @function
 *
 *  Returns a string representation of the 3d matrix.
 **/
CSSMatrix.prototype.getMatrix3dStr = function () {
  var points = [~~(this.m11 * precision) / precision, ~~(this.m12 * precision) / precision, ~~(this.m13 * precision) / precision, ~~(this.m14 * precision) / precision, ~~(this.m21 * precision) / precision, ~~(this.m22 * precision) / precision, ~~(this.m23 * precision) / precision, ~~(this.m24 * precision) / precision, ~~(this.m31 * precision) / precision, ~~(this.m32 * precision) / precision, ~~(this.m33 * precision) / precision, ~~(this.m34 * precision) / precision, ~~(this.m41 * precision) / precision, ~~(this.m42 * precision) / precision, ~~(this.m43 * precision) / precision, ~~(this.m44 * precision) / precision];
  return "matrix3d(" + points.join(", ") + ")";
};

export default CSSMatrix;