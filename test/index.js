var Jango = require('../dist');

function assert (condition) {
  if (!condition)
    throw new Error('Assertion failed');
}

// LITERALS
var a = Jango('test');

// returns an instance of Jango
assert(a instanceof Jango);

// sets the value correctly
assert(a.val() === 'test');

// throws an error if trying to mutate value directly
try {
  a._value = 'anything';
} catch (err) {
  assert(err.message !== 'Assertion failed');
}

// doesn't mutate when setting
a.set('blah'); assert(a.val() === 'test');

// returns same instance if setting same value
assert(a.set('test') === a);

// returns new instance if setting new value
assert(a.set('blah') !== a);


// OBJECTS
var b = Jango({one: 1, two: 2});

// returns an instance of Jango for properties
assert(b.get('one') instanceof Jango);

// sets the value correctly
assert(b.get('one').val() === 1);

// doesn't mutate when setting
b.merge({one: 'val2'}); assert(b.get('one').val() === 1);

// returns same instance if setting same value
assert(b.merge({one: 1, two: 2}) === b);

// returns same instance if setting same partial value
assert(b.merge({one: 1}) === b);
assert(b.set('one', 1) === b);

// overwrites objects
assert(b.set('test').val() === 'test');

// returns new instance if setting new partial value
assert(b.merge({one: 2}) !== b);
assert(b.set('one', 2) !== b);

// returns new instance of changed keys
assert(b.merge({one: 2}).get('one') !== b.get('one'));

// returns same instance of unchanged keys
assert(b.merge({one: 2}).get('two') === b.get('two'));

// allows new keys to be added
assert(b.merge({three: 3}).get('three') instanceof Jango);
assert(b.merge({three: 3}).get('three').val() === 3);
assert(b.merge({three: 3}) !== b);
assert(b.set('three', 3).get('three') instanceof Jango);
assert(b.set('three', 3).get('three').val() === 3);
assert(b.set('three', 3) !== b);


// returns new instance if setting new key
assert(b.merge({three: 3}) !== b);
assert(b.set('three', 3) !== b);


// ARRAYS
var c = Jango([1, 2, 3]);

// returns an instance of Jango for elements
assert(c.get(0) instanceof Jango);

// sets the value correctly
assert(c.get(0).val() === 1);

// doesn't mutate when setting
c.merge([2, 3]); assert(c.get(0).val() === 1);

// returns same instance if setting same value
assert(c.merge([1, 2, 3]) === c);

// returns same instance if setting same partial value
assert(c.merge([1]) === c);
assert(c.set(0, 1) === c);

// returns new instance if setting new partial value
assert(c.merge([2]) !== c);
assert(c.set(0, 2) !== c);

// returns new instance of changed keys
assert(c.merge([2]).get(0) !== c.get(0));

// returns same instance of unchanged keys
assert(c.merge([1]).get(0) === c.get(0));

// allows new keys to be added
assert(c.merge([1, 2, 3, 4]).get(3) instanceof Jango);
assert(c.merge([1, 2, 3, 4]).get(3).val() === 4);
assert(c.set(3, 4).get(3) instanceof Jango);
assert(c.set(3, 4).get(3).val() === 4);

// returns new instance if setting new key
assert(c.merge([1, 2, 3, 4]) !== c);
assert(c.set(3, 4) !== c);


// NESTED VALUES
var d = Jango({one: {two: 'three'}, a: ['b', 'c']});

// returns an instance of Jango for nested properties
assert(d.get(['one', 'two']) instanceof Jango);
assert(d.get(['a', 0]) instanceof Jango);

// returns the correct value for nested properties
assert(d.get(['one', 'two']).val() === 'three');
assert(d.get(['a', 0]).val() === 'b');

// returns same instance if setting same value
assert(d.merge({one: {two: 'three'}}) === d);
assert(d.merge({a: ['b', 'c']}) === d);
assert(d.set(['one', 'two'], 'three') === d);
assert(d.set(['a', 0], 'b') === d);

// returns new instance if setting different value
assert(d.merge({one: {two: 'four'}}) !== d);
assert(d.merge({one: {two: 'four'}}).get(['one', 'two']).val() === 'four');
assert(d.merge({a: ['b', 'd']}) !== d);
assert(d.merge({a: ['b', 'd']}).get(['a', 1]).val() === 'd');
assert(d.set(['one', 'two'], 'four') !== d);
assert(d.set(['one', 'two'], 'four').get(['one', 'two']).val() === 'four');
assert(d.set(['a', 0], 'd') !== d);
assert(d.set(['a', 0], 'd').get(['a', 0]).val() === 'd');