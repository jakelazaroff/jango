'use strict';

(function (root, factory) {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = factory();
  else
    root.Jango = factory();
}(this, function () {

  function isObject (obj) { return typeof obj === 'object'; }
  function isArray (obj) { return Array.isArray(obj); }

  function Jango (value) {
    if (this) {
      Object.defineProperty(this, '_value', {
        value: value
      });
    } else {
      if (isArray(value))
        return new Jango([]).merge(value);

      else if (isObject(value))
        return new Jango({}).merge(value);

      else
        return new Jango(value);
    }
  }

  Jango.prototype.val = function () {
    var array = isArray(this._value);

    if (array || isObject(this._value))
      return Object.keys(this._value).reduce((accumulator, key) => {
        accumulator[key] = this._value[key].val();
        return accumulator;
      }, (array ? [] : {}));
    else
      return this._value;
  };

  Jango.prototype.get = function (key) {
    var path = [].concat(key);
    return path.length ? this._value[path.shift()].get(path) : this;
  };

  Jango.prototype.set = function (key, value) {
    var path = arguments.length === 2 ? [].concat(key) : ((value = key), []);

    if (path.length > 0) {
      var key = path.shift(),
          arr = isArray(this._value);

      if (arr || isObject(this._value)) {
        var assign = arr ? [ ...this._value ] : { ...this._value };
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
    var arr = isArray(value);

    if (arr || isObject(value)) {
      var assign = (arr ? [ ...this._value ] : { ...this._value }), equal = true;

      Object.keys(value).forEach(key => {
        if (this._value[key]) {
          assign[key] = this._value[key].merge(value[key]);
          equal = assign[key] === this._value[key];
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

}));
