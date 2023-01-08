const assert = require('assert');

import {} from '../../../src/utils/array';

describe('Array', function () {
  describe('#removeAll()', function () {
    it('should return empty arrays', function () {
      assert.deepStrictEqual([], [].removeAll());
      assert.deepStrictEqual([], [1].removeAll());
      assert.deepStrictEqual([], [1,2].removeAll());
    });
  });

  describe('#remove()', function () {
    it('should remove the proper elements', function () {
      assert.deepStrictEqual(['1','2'], ['1','2','3'].remove(2));
      assert.deepStrictEqual(['1','3'], ['1','2','3'].remove(1));
      assert.deepStrictEqual(['2','3'], ['1','2','3'].remove(0));

      assert.deepStrictEqual(['1','2'], ['1','2','3'].remove('3'));
      assert.deepStrictEqual(['1','3'], ['1','2','3'].remove('2'));
      assert.deepStrictEqual(['2','3'], ['1','2','3'].remove('1'));

      assert.deepStrictEqual(['1'], ['1','2','3','4'].remove(1,3));
      assert.deepStrictEqual(['3','4'], ['1','2','3','4'].remove(0,1));
    });
    it('should return empty array', function () {
      assert.deepStrictEqual([], ['1','2','3','4'].remove(0,3));
    });
  });

  describe('#findItem()', function () {
    var a = [0,1,2];
    var b = [0,1,2];
    it('should return -1', function () {
      assert.strictEqual(-1, ['1', '2', '3', '4'].findItem(2));
      assert.strictEqual(-1, ['1', '2', '3', '4'].findItem('5'));
      assert.strictEqual(-1, ['1', a, '4'].findItem(b));
    })

    it('should return the proper position', function () {
      assert.strictEqual(1, ['1', '2', '3', '4'].findItem('2'));
      assert.strictEqual(2, ['1', a, b].findItem(b));
    })
  });

  // describe('#removeAll()', function () {
  //   var node = document.createElement ('div')
  //   var a = [0,1,2];
  //   var b = [0,1,2];
    
  //   assertEquals ('testArrayFindItem 1', 1, vs.util._findItem.call(['1','2','3','4'], '2'));
  //   assertEquals ('testArrayFindItem 2',  -1, vs.util._findItem.call(['1','2','3','4'], 2));
  //   assertEquals ('testArrayFindItem 3',  -1, vs.util._findItem.call(['1','2','3','4'], '5'));
  //   assertEquals ('testArrayFindItem 4',  3, vs.util._findItem.call(['1', a, b, node,'4'],node));
  //   assertEquals ('testArrayFindItem 5',  -1, vs.util._findItem.call(['1', a,'4'],b));
  // });

  describe('#clone()', function () {
    it('should clone an array', function () {
      assert.deepStrictEqual([], [].clone());
      assert.deepStrictEqual([1], [1].clone());
      assert.deepStrictEqual([1,2], [1,2].clone());
      assert.deepStrictEqual([0,1,2], [0,1,2].clone());
      var a = [0,1,2];
      var b = a;
      assert.deepStrictEqual(a, b);
      b = a.clone();
      assert.deepStrictEqual(a, b);
    });
  })
});
