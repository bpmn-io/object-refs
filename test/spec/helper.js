'use strict';

module.exports.hasOwnProperty = function (element, property) {
  return Object.prototype.hasOwnProperty.call(element, property);
};

module.exports.expectArraysEqual = function(a, b) {
  expect(a.length).toBe(b.length);

  for (var i = 0; i < a.length; i++) {
    expect(a[i]).toEqual(b[i]);
  }
};