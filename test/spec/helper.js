'use strict';

module.exports.hasProperty = function(element, property) {
  return Object.prototype.hasOwnProperty.call(element, property);
};

module.exports.expectArraysEqual = function(a, b) {
  expect(a.length).to.equal(b.length);

  for (var i = 0; i < a.length; i++) {
    expect(a[i]).to.eql(b[i]);
  }
};