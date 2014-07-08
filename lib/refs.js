'use strict';

var Collection = require('./collection');

function hasOwnProperty(e, property) {
  return Object.prototype.hasOwnProperty.call(e, property.name || property);
}


function defineCollectionProperty(ref, property, target) {
  Object.defineProperty(target, property.name, {
    enumerable: property.enumerable,
    value: Collection.extend([], ref, property, target)
  });
}


function defineProperty(ref, property, target) {

  var inverseProperty = property.inverse;

  var _value;

  Object.defineProperty(target, property.name, {
    enumerable: property.enumerable,

    get: function() {
      return _value;
    },

    set: function(value) {

      // return if we already performed all changes
      if (value === _value) {
        return;
      }

      var old = _value;

      // temporary set null
      _value = null;

      if (old) {
        ref.unset(old, inverseProperty, target);
      }

      // set new value
      _value = value;

      // set inverse value
      ref.set(_value, inverseProperty, target);
    }
  });

}

function Ref(a, b) {

  if (!(this instanceof Ref)) {
    return new Ref(a, b);
  }

  // link
  a.inverse = b;
  b.inverse = a;

  this.props = {};
  this.props[a.name] = a;
  this.props[b.name] = b;
}

Ref.prototype.bind = function(target, property) {
  if (typeof property === 'string') {
    property = this.props[property];
  }

  if (property.collection) {
    defineCollectionProperty(this, property, target);
  } else {
    defineProperty(this, property, target);
  }
};

Ref.prototype.ensureBound = function(target, property) {
  if (!hasOwnProperty(target, property)) {
    this.bind(target, property);
  }
};

Ref.prototype.unset = function(target, property, value) {

  if (target) {
    this.ensureBound(target, property);

    if (property.collection) {
      target[property.name].remove(value);
    } else {
      target[property.name] = undefined;
    }
  }
};

Ref.prototype.set = function(target, property, value) {

  if (target) {
    this.ensureBound(target, property);

    if (property.collection) {
      target[property.name].add(value);
    } else {
      target[property.name] = value;
    }
  }
};


module.exports = Ref;

/* jshint -W001 */
module.exports.hasOwnProperty = hasOwnProperty;