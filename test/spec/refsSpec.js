'use strict';

var Refs = require('../../');

var hasOwnProperty = require('./helper').hasOwnProperty,
    expectArraysEqual = require('./helper').expectArraysEqual;




describe('refs', function() {

  describe('one-to-one', function() {

    var refs = Refs({ name: 'foo' }, { name: 'bar' });


    it('should keep already set property', function() {

      // given
      var b = { };
      var a = { foo: b };

      // when
      refs.bind(a, 'foo');

      // then
      expect(a.foo).toBe(b);
    });


    it('should define property invisibly', function() {

      // given
      var a = {};

      // when
      refs.bind(a, 'foo');

      // then
      expect(a.foo).not.toBeDefined();
      expect(hasOwnProperty(a, 'foo')).toBe(true);
    });


    it('should define non-enumerable property per default', function() {

      // given
      var a = {};

      refs.bind(a, 'foo');
      a.foo = {};

      // when
      var json = JSON.stringify(a);
      expect(json).toBe('{}');
    });


    it('should define enumerable property', function() {

      // given
      var enumerableRefs = Refs({ name: 'foo', enumerable: true }, { name: 'bar' });

      var a = {};

      enumerableRefs.bind(a, 'foo');
      a.foo = {};

      // when
      var json = JSON.stringify(a);
      expect(json).toBe('{"foo":{}}');
    });


    it('should create bi-directional reference', function() {

      // given
      var a = {}, b = {};

      refs.bind(a, 'foo');
      refs.bind(b, 'bar');

      // when
      a.foo = b;

      // then
      expect(a.foo).toBe(b);
      expect(b.bar).toBe(a);
    });


    it('should unset property', function() {

      // given
      var a = {}, b = {};

      refs.bind(a, 'foo');
      refs.bind(b, 'bar');

      // when
      a.foo = b;
      a.foo = null;

      expect(a.foo).toBe(null);
      expect(b.bar).toBe(undefined);
    });


    it('should transitively define properties', function() {

      // given
      var a = {}, b = {};

      refs.bind(a, 'foo');

      // when
      a.foo = b;
      b.bar = null;

      // then
      expect(a.foo).toBe(undefined);
    });


    it('should not allow property deletion', function() {

      // given
      var a = {};

      refs.bind(a, 'foo');

      expect(function() {
        // when
        delete a.foo;
      }).toThrow('Cannot delete property \'foo\' of #<Object>');
    });

  });


  describe('one-to-many', function() {

    var refs = Refs({ name: 'foos', collection: true }, { name: 'bar' });


    it('should define non-enumerable property per default', function() {

      // given
      var a = {};

      refs.bind(a, 'foos');
      a.foos.push({});

      // when
      var json = JSON.stringify(a);
      expect(json).toBe('{}');
    });


    it('should define enumerable property', function() {

      // given
      var enumerableRefs = Refs({ name: 'foos', enumerable: true, collection: true }, { name: 'bar' });

      var a = {};

      enumerableRefs.bind(a, 'foos');
      a.foos.push({});

      // when
      var json = JSON.stringify(a);
      expect(json).toBe('{"foos":[{}]}');
    });


    it('should keep already set property', function() {

      // given
      var b = { };
      var a = { foos: [ b ] };

      // when
      refs.bind(a, 'foos');

      // then
      expectArraysEqual(a.foos, [ b ]);
    });


    it('should define collection property as array', function() {

      // given
      var a = {};

      // when
      refs.bind(a, 'foos');

      // then
      expectArraysEqual(a.foos, []);
    });


    it('should auto-populate collection', function() {

      // given
      var a = {};
      var b1 = {}, b2 = {};

      refs.bind(b1, 'bar');
      refs.bind(b2, 'bar');

      // when
      b1.bar = a;
      b2.bar = a;

      // then
      expectArraysEqual(a.foos, [ b1, b2 ]);
    });


    it('should auto-remove from collection', function() {

      // given
      var a = {};
      var b1 = {}, b2 = {};

      refs.bind(b1, 'bar');
      refs.bind(b2, 'bar');

      b1.bar = a;
      b2.bar = a;

      // when
      b1.bar = null;

      // then
      expectArraysEqual(a.foos, [ b2 ]);
    });


    it('should transitively define properties', function() {

      // given
      var a = {}, b = {};

      refs.bind(a, 'foos');

      // when
      a.foos.add(b);
      b.bar = null;

      // then
      expectArraysEqual(a.foos, []);
    });

  });


  describe('many-to-many', function() {

    var refs = Refs({ name: 'foos', collection: true }, { name: 'bars', collection: true });


    it('should define property invisibly', function() {
      // given
      var b = {};

      // when
      refs.bind(b, 'bars');

      // then
      expectArraysEqual(b.bars, []);
    });


    it('should inverse add', function() {
      // given
      var a = {}, b = {};

      refs.bind(a, 'foos');
      refs.bind(b, 'bars');

      // when
      a.foos.add(b);

      // then
      expectArraysEqual(b.bars, [ a ]);
    });


    it('should add many-to-many', function() {
      // given
      var a1 = {}, a2 = {},
          b1 = {}, b2 = {};

      refs.bind(a1, 'foos');
      refs.bind(a2, 'foos');

      // when
      a1.foos.add(b1);
      a1.foos.add(b2);

      a2.foos.add(b2);

      // then
      expect(b2.bars.contains(a2)).toBe(true);

      expectArraysEqual(b1.bars, [ a1 ]);
      expectArraysEqual(b2.bars, [ a1, a2 ]);
    });


    it('should inverse remove', function() {
      // given
      var a1 = {}, a2 = {},
          b1 = {}, b2 = {};

      refs.bind(a1, 'foos');
      refs.bind(a2, 'foos');

      // when
      a1.foos.add(b1);
      a1.foos.add(b2);

      a2.foos.add(b2);

      b2.bars.remove(a1);

      // then
      expectArraysEqual(b1.bars, [ a1 ]);
      expectArraysEqual(b2.bars, [ a2 ]);
    });


    it('should transitively define properties', function() {

      // given
      var a = {}, b = {};

      refs.bind(a, 'foos');

      // when
      a.foos.add(b);
      b.bars.remove(a);

      // then
      expectArraysEqual(a.foos, []);
      expectArraysEqual(b.bars, []);
    });
  });
});