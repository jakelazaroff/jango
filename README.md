# Jango
[![Codeship](https://img.shields.io/travis/jakelazaroff/jango.svg)](https://travis-ci.org/jakelazaroff/jango)

Jango is a tiny alternative to Immutable.js. It weighs in at 1.14kb gzipped and has no dependencies.

## Installation

```bash
npm install --save jango
```

## Purpose

Jango was born out of a need for a much smaller Immutable.js. Its goal is to efficiently represent nested JavaScript data immutably, while providing one of the most compelling reasons to use immutable data: **strict equality implies deep equality**. In Jango, if any setter method doesn't result in any mutations, it returns itself, which means that `===` can be used for incredibly fast deep equality checks.

## API

A "Jango" is an object created with the Jango factory that holds a single value. Its API consists of methods treating it as a recursive data structure, allowing it to represent and traverse JavaScript objects and arrays.

### Jango()
Creates a Jango. Complex data structures passed to the factory are recursively converted.

```javascript
var plain = Jango(1);

var object = Jango({one: 1, two: 2, three: 3});

var array = Jango([1, 2, 3]);

var nested = Jango({obj: {one: 1, two: 2, three: 3}, arr: [1, 2, 3]});
```

### .val([key, options])
Recursively converts the value of the Jango object back to a JavaScript object. Pass a string or array to convert the value at that path.

#### options
- *shallow:* only converts the root object, not any nested Jangos.

```javascript
plain.val(); // 1

object.val(); // {one: 1, two: 2, three: 3}

array.val(); // [1, 2, 3]

nested.val(); // {obj: {one: 1, two: 2, three: 3}, arr: [1, 2, 3]}

nested.val(['obj', 'one']) // 1

obj.val({shallow: true}) // {one: Jango(1), two: Jango(2), three: Jango(3)}
```

### .get(key)
Returns the Jango at the given key. Pass an array instead of a string to get a nested Jango.

```javascript
object.get('one'); // Jango(1)

array.get(0); // Jango(1)

nested.get(['obj', 'three']) // Jango(3)
```

### .set([key], value)
Replaces either the entire Jango or the given key with the given value. Pass an array key instead of a string to set a nested Jango.

Returns the same object if no mutation occurs.

```javascript
plain.set(2); // Jango(2)

object.set('two', {three: 'four'}); // Jango({one: 2, two: {three: four}, three: 3})

array.set(0, 2); // Jango([2, 2, 3])

nested.set(['arr', 2], 4); // Jango({obj: {one: 1, two: 2, three: 3}, arr: [1, 2, 4]})

object.set('one', 1) === object; // true
object.set('three', 9) === object; // false
```

### .merge(source)
Merges the source into the Jango, adding or replacing any keys in the source but leaving keys only in the destination.

Returns the same object if no mutation occurs.

```javascript
object.merge({'one': 2}); // Jango({one: 2, two: 2, three: 3})

array.merge([2]); // Jango([2, 2, 3])

nested.merge({add: 'value'}); // Jango({add: 'value', obj: {one: 1, two: 2, three: 3}, arr: [1, 2, 4]})
```

### .filter(fn)
Filters out keys or elements of the Jango for which the predicate returns false.

Returns the same object if no mutation occurs.

```javascript
object.filter(function (item) { return item.val() !== 1; }); // Jango({two: 2, three: 3})

array.filter(function (item) { return item.val() !== 1; }); // Jango([2, 3])

array.filter(function (item) { return true; }) === object; // true
array.filter(function (item) { return item.val() + 1; }) === object; // false
```

### .map(fn)
Maps keys or elements of the Jango to a new Jango.

Returns the same object if no mutation occurs.

```javascript
object.map(function (item) { return item.val() * 2; }); // Jango({one: 2, two: 4, three: 6})

array.map(function (item) } return item.val() * 2; }); // Jango([1, 2, 3])

object.map(function (item) { return item; }) === object; // true
object.map(function (item) { return item.val() + 1; }) === object; // false

```

## Comparisons

### Immutable.js

The original inspiration for Jango. Immutable provides a large API, and collections that mirror ES6 iterable Maps and Sets. However, it's 18.8kb gzipped and likely provides much more functionality than your application needs.

**Use Jango if:**
- Filesize is an important factor in your application

**Use Immutable if:**
- You need a robust and set of methods for representing and manipulating your data

### Freezer.js

A different approach to application development, Freezer also provides an event system so that you can build your application in a reactive way. However, it's less useful with libraries like Redux.

**Use Jango if:**
- You need an immutable data structure to plug into your Redux store

**Use Freezer if:**
- Your application is built reactively

### Scour.js

Scour's main objective is to provide Lodash-like functionality to immutable objects. It has a large utility belt of methods and a small filesize, but operations that don't mutate the original object still return a new reference.

**Use Jango if:**
- You need fast equality comparisons

**Use Scour if:**
- You need Lodash-like utility methods
