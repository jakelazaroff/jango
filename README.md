# Jango
A tiny alternative to Immutable.js

## API
- Jango() - creates an immutable object
- Jango.val() - converts the value of the immutable object back to a javascript object
- Jango.get([key]) - gets a (nested) immutable object
- Jango.set(value) - sets the value of the immutable object
- Jango.set([key], value) - sets the value of a (nested) key in the immutable object
- Jango.merge(value) - merges the value into the immutable object

- Jango.filter(fn) - filters out keys or elements of the immutable object for which the predicate returns false
- Jango.map(fn) - maps keys or elements of the immutable object to a new immutable object
