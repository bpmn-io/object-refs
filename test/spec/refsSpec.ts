import {
  Refs,
  Collection
} from '../../dist/index';

import { expect } from 'chai';


describe('types', function() {

  describe('should type Refs', function() {

    var refs = new Refs({ name: 'foo' }, { name: 'bar' });


    it('should keep already set property', function() {

      // given
      var b = { };
      var a = { foo: b };

      // when
      refs.bind(a, 'foo');

      // then
      expect(a.foo).to.equal(b);
    });

  });


  describe('should type Collection', function() {

    it('should keep already set property', function() {

      // when
      const collection = [];

      // then
      expect(Collection.isExtended(collection)).to.be.false;
    });

  });

});