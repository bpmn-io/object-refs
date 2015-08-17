'use strict';

var Refs = require('../../');


describe('collection api', function() {

  var refs = new Refs({ name: 'foos', collection: true }, { name: 'bar' });


  describe('#contains', function() {

    it('should not contain', function() {

      // given
      var a = { foos: [] };

      // when
      refs.bind(a, 'foos');

      // then
      expect(a.foos.contains({})).to.equal(false);
    });


    it('should contain', function() {

      // given
      var b = {}, a = { foos: [ b ] };

      // when
      refs.bind(a, 'foos');

      // then
      expect(a.foos.contains(b)).to.equal(true);
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
      expect(a.foos.contains(b)).to.equal(true);
    });


    it('should inverse add', function() {

      // given
      var a = {};
      var b = {};

      refs.bind(a, 'foos');

      // when
      a.foos.add(b);

      // then
      expect(b.bar).to.equal(a);
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
      expect(a.foos).to.eql([ ]);
      expect(b.bar).not.to.exist;

    });

  });

});