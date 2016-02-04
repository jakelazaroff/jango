// libraries
require('chai').should();
var expect = require('chai').expect;

// jango
var Jango = require('../dist');

describe('Jango', function () {

  var a = Jango('test'),
      b = Jango({one: 1, two: 2}),
      c = Jango([1, 2, 3]),
      d = Jango({one: {two: 'three'}, a: ['b', 'c']});

  describe('constructor', function () {

    it('should return an instance of jango', function () {
      a.should.be.an.instanceof(Jango);
    });

    it('should set the value correctly', function () {
      a.val().should.equal('test');
    });

    it('should create instances of jango in an object', function () {
      b.get('one').should.be.an.instanceof(Jango);
    });

    it('should create instances of jango in an array', function () {
      c.get(0).should.be.an.instanceof(Jango);
    });

    it('should set the values correctly in an object', function () {
      b.val('one').should.equal(1);
    });

    it('should set the values correctly in an array', function () {
      c.val(0).should.equal(1);
    });

    it('should recursively create nested instances of jango', function () {
      d.get(['one', 'two']).should.be.an.instanceof(Jango);
      d.get(['a', 0]).should.be.an.instanceof(Jango);
    });

    it('should recursively set the values correctly ', function () {
      d.val(['one', 'two']).should.equal('three');
      d.val(['a', 0]).should.equal('b');
    });
  });

  describe('.val', function () {

    it('should return the value', function () {
      a.val().should.equal('test');
    });

    it('should return nested values', function () {
      b.val().should.eql({one: 1, two: 2});
      c.val().should.eql([1, 2, 3]);
    });

    it('should traverse up a tree to return nested values if key is passed', function () {
      b.val('one').should.equal(1);
      c.val(0).should.equal(1);
      d.val(['one', 'two']).should.equal('three');
    });

    it('should return undefined if no value is found', function () {
      expect(a.val('one')).not.to.exist;
    });

    it('should not recursively return values if `shallow` options is passed', function () {
      var b3 = b.val({shallow: true});

      b.get('one').should.equal(b3['one']);
      b.get('two').should.equal(b3['two']);

      var c3 = c.val({shallow: true});

      c.get(0).should.equal(c3[0]);
      c.get(1).should.equal(c3[1]);
      c.get(2).should.equal(c3[2]);
    });
  });

  describe('.get', function () {

    it('should return itself if not passed a key', function () {
      a.get().should.equal(a);
    });

    it('should return an instance of jango if passed a key in the value', function () {
      b.get('one').should.be.an.instanceof(Jango);
      b.val('one').should.equal(1);
    });

    it('should return an instance of jango if passed a nonexistent key', function () {
      expect(b.get('nope')).not.to.exist;
    });

    it('should return a nested instance of jango if passed an array', function () {
      d.get(['one', 'two']).should.be.an.instanceof(Jango);
      d.val(['one', 'two']).should.equal('three');
    });
  });

  describe('.set', function () {

    it('shouldn\'t mutate when setting', function () {
      a.set('blah');
      a.val().should.equal('test');
    });

    it('should convert objects and arrays to instances of jango', function () {
      a.set({one: 1}).get('one').should.be.an.instanceof(Jango);
      a.set([1]).get(0).should.be.an.instanceof(Jango);
    });

    it('should set nested value if passed an array', function () {
      d.set(['one', 'two'], 'three').val(['one', 'two']).should.equal('three');
    });

    it('should return the same instance if setting the same value', function () {
      a.set('test').should.equal(a);
    });

    it('should return the same instance if returning a jango with the same value', function () {
      a.set(Jango('test')).should.equal(a);
    });

    it('should return a new instance if setting a new value', function () {
      a.set('blah').val().should.equal('blah');
      a.set('blah').val().should.not.equal(a);
    });

    it('should return a new instance if setting a jango with a new value', function () {
      a.set(Jango('blah')).val().should.equal('blah');
      a.set(Jango('blah')).val().should.not.equal(a);
    });

    it('should return the same instance if setting same partial value', function () {
      b.set('one', 1).should.equal(b);
      c.set(0, 1).should.equal(c);
      d.set(['one', 'two'], 'three').should.equal(d);
      d.set('one', {two: 'three'}).should.equal(d);
      d.set(['a', 0], 'b').should.equal(d);
    });

    it('should return a new instance if setting a different partial value', function () {
      b.set('one', 2).should.not.equal(b);
      c.set(0, 2).should.not.equal(c);
      d.set(['one', 'two'], 'four').should.not.equal(d);
      d.set('one', {two: 'four'}).should.not.equal(d);
      d.set(['a', 0], 'c').should.not.equal(d);
    });

    it('should return same instances of unchanged keys', function () {
      b.set('one', 2).get('two').should.equal(b.get('two'));
      c.set(0, 2).get(1).should.equal(c.get(1));
    });

    it('should return new instances of changed keys', function () {
      b.set('one', 2).get('one').should.not.equal(b.get('one'));
      c.set(0, 2).get(0).should.not.equal(c.get(0));
    });

    it('should return a new instance if adding a new key', function () {
      b.set('three', 3).val('three').should.equal(3);
      b.set('three', 3).should.not.equal(b);
      c.set(3, 4).val(3).should.equal(4);
      c.set(3, 4).should.not.equal(c);
    });

    it('should overwrite the old value if no key is specified', function () {
      b.set('blah').val().should.equal('blah');
    });
  });

  describe('.merge', function () {

    it('should return the same instance if setting the same value', function () {
      b.merge({one: 1, two: 2}).should.equal(b);
      c.merge([1, 2, 3]).should.equal(c);
      d.merge({one: {two: 'three'}}).should.equal(d);
      d.merge({a: ['b', 'c']}).should.equal(d);
    });

    it('should return the same instance if setting the same partial value', function () {
      b.merge({one: 1}).should.equal(b);
      c.merge([1]).should.equal(c);
    });

    it('should return a new instance if setting a new partial value', function () {
      b.merge({one: 2}).should.not.equal(b);
      b.merge({one: 2}).val('one').should.equal(2);

      c.merge([2]).should.not.equal(c);
      c.merge([2]).val(0).should.equal(2);

      d.merge({one: {two: 'four'}}).should.not.equal(d);
      d.merge({one: {two: 'four'}}).val(['one', 'two']).should.equal('four');
      d.merge({a: ['b', 'd']}).should.not.equal(d);
      d.merge({a: ['b', 'd']}).val(['a', 1]).should.equal('d');
    });

    it('should return the same instance of unchanged keys', function () {
      b.merge({one: 2}).get('two').should.equal(b.get('two'));
      c.merge([2]).get(1).should.equal(c.get(1));
    });

    it('should return a new instance of changed keys', function () {
      b.merge({one: 2}).get('one').should.not.equal(b.get('one'));
      c.merge([2]).get(0).should.not.equal(c.get(0));
    });

    it('should return a new instance if adding a new key', function () {
      b.merge({three: 3}).val('three').should.equal(3);
      b.merge({three: 3}).should.not.equal(b);
      c.merge([1, 2, 3, 4]).val(3).should.equal(4);
      c.merge([1, 2, 3, 4]).should.not.equal(c);
    });

    it('should merge deeply nested jangos', function () {
      var e = Jango({one: Jango({two: Jango({three: Jango('four')}) }) });
      e.merge(e).should.equal(e);
    });
  });

  describe('.filter', function () {

    var f = Jango({obj: {one: 1, two: 2}, arr: [1, 2]});

    it('should pass each child, key and itself to the predicate', function () {

      f.get('obj').filter(function (child, key, self) {
        child.should.equal(f.get(['obj', key]));
        self.should.equal(f.get('obj'));
      });

      f.get('arr').filter(function (child, key, self) {
        child.should.equal(f.get(['arr', key]));
        self.should.equal(f.get('arr'));
      });
    });

    it('should return the same instance if all predicates return true', function () {

      var g = f.get('obj').filter(function (child) { return true; });
      g.should.equal(f.get('obj'));
      g.val('one').should.equal(1);
      g.val('two').should.equal(2);


      var g = f.get('arr').filter(function (child) { return true; });
      g.should.equal(f.get('arr'));
      g.val(0).should.equal(1);
      g.val(1).should.equal(2);
    });

    it('should return a new instance if any value is different', function () {

      var g = f.get('obj').filter(function (child) { return child.val() !== 1; });
      g.should.not.equal(f.get('obj'));
      g.val('two').should.equal(2);
      Object.keys(g.val()).length.should.equal(1);

      g = f.get('arr').filter(function (child) { return child.val() !== 1; });
      g.should.not.equal(f.get('arr'));
      g.val(0).should.equal(2);
      Object.keys(g.val()).length.should.equal(1);
    });
  });

  describe('.map', function () {

    var m = Jango({obj: {one: 1, two: 2}, arr: [1, 2]});

    it('should pass each child, key and itself to the predicate', function () {

      m.get('obj').map(function (child, key, self) {
        child.should.equal(m.get(['obj', key]));
        self.should.equal(m.get('obj'));
      });

      m.get('arr').map(function (child, key, self) {
        child.should.equal(m.get(['arr', key]));
        self.should.equal(m.get('arr'));
      });
    });

    it('should return the same instance if all values are the same', function () {

      var n = m.get('obj').map(function (child) { return child.val(); });
      n.should.equal(m.get('obj'));
      n.get('one').val().should.equal(1);
      n.get('two').val().should.equal(2);

      var n = m.get('obj').map(function (child) { return child });
      n.should.equal(m.get('obj'));
      n.get('one').val().should.equal(1);
      n.get('two').val().should.equal(2);

      var n = m.get('arr').map(function (child) { return child.val(); });
      n.should.equal(m.get('arr'));
      n.get(0).val().should.equal(1);
      n.get(1).val().should.equal(2);

      var n = m.get('arr').map(function (child) { return child });
      n.should.equal(m.get('arr'));
      n.get(0).val().should.equal(1);
      n.get(1).val().should.equal(2);
    });

    it('should return a new instance if any value is different', function () {

      var n = m.get('obj').map(function (child) { return child.val() * 2; });
      n.should.not.equal(m.get('obj'));
      n.get('one').val().should.equal(2);
      n.get('two').val().should.equal(4);

      n = m.get('arr').map(function (child) { return child.val() * 2; });
      n.should.not.equal(m.get('arr'));
      n.get(0).val().should.equal(2);
      n.get(1).val().should.equal(4);
    });
  });
});
