'use strict';

var Refs = require('../../');

var hasOwnProperty = Refs.hasOwnProperty;


describe('Object.defineProperty mechanics', function() {

  it('should have null property', function() {

    // given
    var a = {};

    // when
    Object.defineProperty(a, 'foo', {
      value: undefined
    });

    // then
    expect(a.value).not.toBeDefined();
    expect(hasOwnProperty(a, 'foo')).toBe(true);
  });


  it('should not have property after deletion', function() {

    // given
    var a = {};

    Object.defineProperty(a, 'foo', {
      value: undefined,
      configurable: true
    });

    // when
    delete a.foo;

    // then
    expect(hasOwnProperty(a, 'foo')).toBe(false);
  });

});