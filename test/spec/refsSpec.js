'use strict';

var Refs = require('../../'),
    hasOwnProperty = Refs.hasOwnProperty;


function expectArraysEqual(a, b) {
  expect(a.length).toBe(b.length);

  for (var i = 0; i < a.length; i++) {
    expect(a[i]).toEqual(b[i]);
  }
}


describe('refs', function() {

  describe('one-to-one', function() {

    it('should define property invisibly', function() {

      // given
      var ref = Refs({ name: 'foo' }, { name: 'bar' });

      var a = {};

      // when
      ref.bind(a, 'foo');

      // then
      expect(a.foo).not.toBeDefined();
      expect(hasOwnProperty(a, 'foo')).toBe(true);
    });


    it('should define non-enumerable property per default', function() {

      // given
      var ref = Refs({ name: 'foo' }, { name: 'bar' });

      var a = {};

      ref.bind(a, 'foo');
      a.foo = {};

      // when
      var json = JSON.stringify(a);
      expect(json).toBe('{}');
    });


    it('should define enumerable property', function() {

      // given
      var ref = Refs({ name: 'foo', enumerable: true }, { name: 'bar' });

      var a = {};

      ref.bind(a, 'foo');
      a.foo = {};

      // when
      var json = JSON.stringify(a);
      expect(json).toBe('{"foo":{}}');
    });


    it('should create bi-directional reference', function() {

      // given
      var ref = Refs({ name: 'foo' }, { name: 'bar' });

      var a = {}, b = {};

      ref.bind(a, 'foo');
      ref.bind(b, 'bar');

      // when
      a.foo = b;

      // then
      expect(a.foo).toBe(b);
      expect(b.bar).toBe(a);
    });


    it('should unset property', function() {

      // given
      var ref = Refs({ name: 'foo' }, { name: 'bar' });

      var a = {}, b = {};

      ref.bind(a, 'foo');
      ref.bind(b, 'bar');

      // when
      a.foo = b;
      a.foo = null;

      expect(a.foo).toBe(null);
      expect(b.bar).toBe(undefined);
    });


    it('should transitively define properties', function() {

      // given
      var ref = Refs({ name: 'foo' }, { name: 'bar' });

      var a = {}, b = {};

      ref.bind(a, 'foo');

      // when
      a.foo = b;
      b.bar = null;

      // then
      expect(a.foo).toBe(undefined);
    });


    it('should not allow property deletion', function() {

      // given
      var ref = Refs({ name: 'foo' }, { name: 'bar' });

      var a = {};

      ref.bind(a, 'foo');

      expect(function() {
        // when
        delete a.foo;
      }).toThrow('Cannot delete property \'foo\' of #<Object>');
    });

  });


  describe('one-to-many', function() {

    it('should define non-enumerable property per default', function() {

      // given
      var ref = Refs({ name: 'foo', collection: true }, { name: 'bar' });

      var a = {};

      ref.bind(a, 'foo');
      a.foo.push({});

      // when
      var json = JSON.stringify(a);
      expect(json).toBe('{}');
    });


    it('should define enumerable property', function() {

      // given
      var ref = Refs({ name: 'foo', enumerable: true, collection: true }, { name: 'bar' });

      var a = {};

      ref.bind(a, 'foo');
      a.foo.push({});

      // when
      var json = JSON.stringify(a);
      expect(json).toBe('{"foo":[{}]}');
    });


    it('should define collection property as array', function() {

      // given
      var ref = Refs({ name: 'foos', collection: true }, { name: 'bar' });

      var a = {};

      // when
      ref.bind(a, 'foos');

      // then
      expectArraysEqual(a.foos, []);
    });


    it('should populate collection property', function() {

      // given
      var ref = Refs({ name: 'foos', collection: true }, { name: 'bar' });

      var a = {};
      var b1 = {}, b2 = {};

      ref.bind(b1, 'bar');
      ref.bind(b2, 'bar');

      // when
      b1.bar = a;
      b2.bar = a;

      // then
      expectArraysEqual(a.foos, [ b1, b2 ]);
    });


    it('should remove from collection property', function() {

      // given
      var ref = Refs({ name: 'foos', collection: true }, { name: 'bar' });

      var a = {};
      var b1 = {}, b2 = {};

      ref.bind(b1, 'bar');
      ref.bind(b2, 'bar');

      b1.bar = a;
      b2.bar = a;

      // when
      b1.bar = null;

      // then
      expectArraysEqual(a.foos, [ b2 ]);
    });

  });


  xdescribe('many-to-many', function() {

  });
});