'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function (root, factory) {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') module.exports = factory();else root.Jango = factory();
})(undefined, function () {

  function isObject(obj) {
    return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
  }
  function isArray(obj) {
    return Array.isArray(obj);
  }

  function Jango(value) {
    if (this) {
      Object.defineProperty(this, '_value', {
        value: value
      });
    } else {
      if (isArray(value)) return new Jango([]).merge(value);else if (isObject(value)) return new Jango({}).merge(value);else return new Jango(value);
    }
  }

  Jango.prototype.val = function () {
    var _this = this;

    var array = isArray(this._value);

    if (array || isObject(this._value)) return Object.keys(this._value).reduce(function (accumulator, key) {
      accumulator[key] = _this._value[key].val();
      return accumulator;
    }, array ? [] : {});else return this._value;
  };

  Jango.prototype.get = function (key) {
    var path = [].concat(key);
    return path.length ? this._value[path.shift()].get(path) : this;
  };

  Jango.prototype.set = function (key, value) {
    var path = arguments.length === 2 ? [].concat(key) : (value = key, []);

    if (path.length > 0) {
      var key = path.shift(),
          arr = isArray(this._value);

      if (arr || isObject(this._value)) {
        var assign = arr ? [].concat(_toConsumableArray(this._value)) : _extends({}, this._value);
        assign[key] = key in this._value ? this._value[key].set(path, value) : Jango(value);
        return assign[key] === this._value[key] ? this : new Jango(assign);
      } else {
        throw new Error('Can\'t set key "' + key + '" of literal "' + this._value + '"');
      }
    } else {
      return this._value === value ? this : Jango(value);
    }
  };

  Jango.prototype.merge = function (value) {
    var _this2 = this;

    var arr = isArray(value);

    if (arr || isObject(value)) {
      var assign = arr ? [].concat(_toConsumableArray(this._value)) : _extends({}, this._value),
          equal = true;

      Object.keys(value).forEach(function (key) {
        if (_this2._value[key]) {
          assign[key] = _this2._value[key].merge(value[key]);
          equal = assign[key] === _this2._value[key];
        } else {
          equal = false;
          assign[key] = Jango(value[key]);
        }
      });

      return equal ? this : new Jango(assign);
    } else {
      return this.set(value);
    }
  };

  return Jango;
});