'use strict';

var Refs = require('../../');

var hasOwnProperty = require('./helper').hasOwnProperty,
    expectArraysEqual = require('./helper').expectArraysEqual;


describe('collection api', function() {

  var refs = Refs({ name: 'foos', collection: true }, { name: 'bar' });


  describe('#contains', function() {

    it('should not contain', function() {

      // given
      var a = { foos: [] };

      // when
      refs.bind(a, 'foos');

      // then
      expect(a.foos.contains({})).toBe(false);
    });


    it('should contain', function() {

      // given
      var b = {}, a = { foos: [ b ] };

      // when
      refs.bind(a, 'foos');

      // then
      expect(a.foos.contains(b)).toBe(true);
    });

  });


  describe('#add', function() {

    it('should add', function() {

      // given
      var a = {};
      var b = {};

      refs.bind(a, 'foos');

      // when
      a.foos.add(b);

      // then
      expect(a.foos.contains(b)).toBe(true);
    });


    it('should inverse add', function() {

      // given
      var a = {};
      var b = {};

      refs.bind(a, 'foos');

      // when
      a.foos.add(b);

      // then
      expect(b.bar).toBe(a);
    });

  });

  describe('#remove', function() {

    it('should inverse remove', function() {

      // given
      var a = {};
      var b = {};

      refs.bind(a, 'foos');

      // when
      a.foos.add(b);
      a.foos.remove(b);

      // then
      expectArraysEqual(a.foos, [ ]);
      expect(b.bar).toBe(undefined);

    });

  });

});