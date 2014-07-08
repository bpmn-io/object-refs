'use strict';

function extend(collection, ref, property, target) {

  var inverseProperty = property.inverse;

  collection.remove = function(element) {
    var idx = this.indexOf(element);
    if (idx !== -1) {
      this.splice(idx, 1);

      // unset inverse
      ref.unset(element, inverseProperty, target);
    }

    return element;
  };

  collection.contains = function(element) {
    return this.indexOf(element) !== -1;
  };

  collection.add = function(element) {

    if (!this.contains(element)) {
      this.push(element);

      // set inverse
      ref.set(element, inverseProperty, target);
    }
  };

  return collection;
}


module.exports.extend = extend;