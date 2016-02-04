'use strict';

(function (root, factory) {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = factory();
  else
    root.Jango = factory();
}(this, function () {

  function isObject (obj) { return obj && typeof obj === 'object' && obj.constructor === Object; }
  function isArray (obj) { return obj && Array.isArray(obj); }

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

  Jango.isJango = function (obj) {
    return obj && Jango.toString() === obj.constructor.toString();
  };

  Jango.prototype.val = function (key, options = {}) {
    var array = isArray(this._value),
        object = isObject(this._value);


    if (isObject(key))
      options = key, key = undefined;

    if (key = [].concat(key), typeof key[0] !== 'undefined' && key.length) {

      if (array || object) {
        var nested = this.get(key);
        return nested && nested.val(options);
      } else return undefined;
    } else {

      if ((array || object) && !options.shallow)
        return Object.keys(this._value).reduce((accumulator, key) => {
          accumulator[key] = this._value[key].val();
          return accumulator;
        }, (array ? [] : {}));

      else
        return this._value;
    }
  };

  Jango.prototype.get = function (key) {
    var path = [].concat(key),
        traversing = typeof path[0] !== 'undefined' && path.length,
        key = path.shift();

    if (traversing)
      return key in this._value ? this._value[key].get(path) : undefined;
    else
      return this;
  };

  Jango.prototype.set = function (key, value) {
    var path = arguments.length === 2 ? [].concat(key) : ((value = key), []);

    // if value is an instance of jango, unwrap it
    if (Jango.isJango(value))
      value = value.val({shallow: true});

    // if this is a branch
    if (path.length > 0) {
      var key = path.shift(),
          arr = isArray(this._value);

      // if traversing through an array or an object
      if (arr || isObject(this._value)) {

        // set the appropriate key if it exists, or create it
        var next = key in this._value ? this._value[key].set(path, value) : Jango(value);

        // if the value is different, return a copy with the new value in place of the old; otherwise, return this
        return next === this._value[key] ? this : new Jango(arr ?

            // if this holds an array, replace the old element with the new one
            (a => { a.splice(key, 1, next); return a; })([ ...this._value ]) :

            // if this holds an object, replace the old key with the new one
            { ...this._value, ...{[key]: next} }
          );

      // if trying to traverse through a literal, throw an error
      } else {
        throw new Error('Can\'t set key "' + key + '" of literal "' + this._value + '"');
      }

    // if this is a leaf
    } else {
      var arr = isArray(value) && isArray(this._value);

      // if replacing an array with an array or an object with an object
      if (arr || (isObject(value) && isObject(this._value))) {

        // merge the value into this non-additively (removing keys found only in value)
        return this.merge(value, false);

      // if replacing a literal with a literal (or mismatched types)
      } else {

        // return a new value if it's different; otherwise, return this
        return this._value === value ? this : Jango(value);
      }
    }
  };

  Jango.prototype.merge = function (source, additive = true) {

    // if source is a jango, unwrap it
    if (Jango.isJango(source))
      source = source.val({shallow: true});

    var arr = isArray(source);

    // if merging an array or an object
    if (arr || isObject(source)) {
      var equal = true,

          assign = (arr ?

            // if this holds an array, create a union of the source and destination array indices
            Object.keys(source.length > this._value.length ? source : this._value) :

            // if this holds an object, create a union of the source and destionation keys
            Object.keys({ ...this._value, ...source }))
              .reduce((assign, key) => {

                // if the key holds a jango, unwrap it
                var value = Jango.isJango(source[key]) ? source[key].val({shallow: true}) : source[key];

                // if the key is in both the source and destination, set it
                if (key in source && key in this._value)
                  assign[key] = this._value[key].set(value);

                // if the key is in the destination but not the source, add it
                else if (key in source)
                  assign[key] = Jango(value);

                // if the key is in the source but not the destination, copy it if merging additively
                else if (additive)
                  assign[key] = this._value[key];

                // check if any prior keys or the (lack of a) new key have changed
                equal = equal && assign[key] === this._value[key];

                return assign;
              }, arr ? [] : {});

      // return a copy with the changed keys if anything has changed; otherwise, return this
      return equal ? this : new Jango(assign);

    // if merging a literal, just set it
    } else {
      return this.set(source);
    }
  };

  Jango.prototype.map = function (fn) {
    var arr = isArray(this._value);

    if (arr || isObject(this._value)) {
      var equal = true,

          assign = Object.keys(this._value).reduce((assign, key, index) => {
            assign[key] = this.set(key, fn(this.get(key), key, this)).get(key);

            equal = equal && assign[key] === this.get(key);

            return assign;
          }, arr ? [ ...this._value ] : { ...this._value });

      return equal ? this : new Jango(assign);
    } else {
      throw new Error('Can\'t iterate over literal "' + this._value + '"');
    }
  };

  Jango.prototype.filter = function (fn) {
    var arr = isArray(this._value);

    if (arr || isObject(this._value)) {
      var equal = true,

          assign = Object.keys(this._value).reduce((assign, key, index) => {

            if (fn(this.get(key), key, this))
              arr ? assign.push(this.get(key)) : assign[key] = this.get(key);

            else
              equal = false;

            return assign;
          }, arr ? [] : {});

      return equal ? this : new Jango(assign);
    } else {
      throw new Error('Can\'t iterate over literal "' + this._value + '"');
    }
  };

  var a = Jango({one: Jango({two: Jango({three: 'four'}) }) });

  return Jango;

}));
