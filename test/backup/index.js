var Jango = require('../../dist');

function assert (condition) {
  if (!condition)
    throw new Error('Assertion failed');
}

// NESTED VALUES

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
