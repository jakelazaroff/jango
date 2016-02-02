var Jango = require('../../dist');

function assert (condition) {
  if (!condition)
    throw new Error('Assertion failed');
}

// OBJECTS
var b = Jango({one: 1, two: 2});

// returns same instance if setting same value
assert(b.merge({one: 1, two: 2}) === b);

// returns same instance if setting same partial value
assert(b.merge({one: 1}) === b);

// returns new instance if setting new partial value
assert(b.merge({one: 2}) !== b);

// returns new instance of changed keys
assert(b.merge({one: 2}).get('one') !== b.get('one'));

// returns same instance of unchanged keys
assert(b.merge({one: 2}).get('two') === b.get('two'));

// returns new instance if setting new key
assert(b.merge({three: 3}) !== b);


// ARRAYS
var c = Jango([1, 2, 3]);

// doesn't mutate when setting
c.merge([2, 3]); assert(c.get(0).val() === 1);

// returns same instance if setting same value
assert(c.merge([1, 2, 3]) === c);

// returns same instance if setting same partial value
assert(c.merge([1]) === c);

// returns new instance if setting new partial value
assert(c.merge([2]) !== c);

// returns new instance of changed keys
assert(c.merge([2]).get(0) !== c.get(0));

// returns same instance of unchanged keys
assert(c.merge([1]).get(0) === c.get(0));

// allows new keys to be added
assert(c.merge([1, 2, 3, 4]).get(3) instanceof Jango);
assert(c.merge([1, 2, 3, 4]).get(3).val() === 4);

// returns new instance if setting new key
assert(c.merge([1, 2, 3, 4]) !== c);


// NESTED VALUES

// returns same instance if setting same value
assert(d.merge({one: {two: 'three'}}) === d);
assert(d.merge({a: ['b', 'c']}) === d);

// returns new instance if setting different value
assert(d.merge({one: {two: 'four'}}) !== d);
assert(d.merge({one: {two: 'four'}}).get(['one', 'two']).val() === 'four');
assert(d.merge({a: ['b', 'd']}) !== d);
assert(d.merge({a: ['b', 'd']}).get(['a', 1]).val() === 'd');

// merges deeply nested jangos
d = Jango({one: Jango({two: Jango({three: Jango('four')}) }) });
assert(d.merge(d) === d);
d = Jango({one: [Jango({two: Jango(2)}), Jango({three: Jango(3)}), Jango({four: Jango(4)})]});
assert(d.set('one', d.get('one').map(item => item.merge(item))) === d);


// MAP
var m = Jango({obj: {one: 1, two: 2}, arr: [1, 2]});

// passes each child and the key to the predicate
m.get('obj').map(function (child, key, self) { assert(child === m.get(['obj', key])); assert(self === m.get('obj')); });
m.get('arr').map(function (child, key, self) { assert(child === m.get(['arr', key])); assert(self === m.get('arr')); });

// returns same instance if setting same values
var n = m.get('obj').map(function (child) { return child.val(); });
assert(n === m.get('obj'));
assert(n.get('one').val() === 1);
assert(n.get('two').val() === 2);
var n = m.get('arr').map(function (child) { return child.val(); });
assert(n === m.get('arr'));
assert(n.get(0).val() === 1);
assert(n.get(1).val() === 2);

// returns different instance if setting new values
var n = m.get('obj').map(function (child) { return child.val() * 2; });
assert(n !== m.get('obj'));
assert(n.get('one').val() === 2);
assert(n.get('two').val() === 4);
n = m.get('arr').map(function (child) { return child.val() * 2; });
assert(n !== m.get('arr'));
assert(n.get(0).val() === 2);
assert(n.get(1).val() === 4);


// FILTER
var m = Jango({obj: {one: 1, two: 2}, arr: [1, 2]});

// passes each child, the key and itself to the predicate
m.get('obj').filter(function (child, key, self) { assert(child === m.get(['obj', key])); assert(self === m.get('obj')); });
m.get('arr').filter(function (child, key, self) { assert(child === m.get(['arr', key])); assert(self === m.get('arr')); });

// returns same instance if no elements are removed
var n = m.get('obj').filter(function () { return true; });
assert(n === m.get('obj'));
assert(n.get('one').val() === 1);
assert(n.get('two').val() === 2);
var n = m.get('arr').filter(function () { return true; });
assert(n === m.get('arr'));
assert(n.get(0).val() === 1);
assert(n.get(1).val() === 2);

// returns different instance if some values are removed
var n = m.get('obj').filter(function (child) { return child.val() !== 1; });
assert(n !== m.get('obj'));
assert(n.get('two').val() === 2);
assert(Object.keys(n.val()).length === 1);
n = m.get('arr').filter(function (child) { return child.val() !== 1; });
assert(n !== m.get('arr'));
assert(n.get(0).val() === 2);
assert(n.val().length === 1);
