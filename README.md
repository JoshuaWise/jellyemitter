# jellyemitter
An event emitter that's completely generic, and doesn't suck.

## How is this event emitter different from the standard Node.js EventEmitter?

- `error` is not a special event.
- `newListener` and `removeListener` are not special events.
- There are no special events.
- Fuck special events.
- All events are treated equally.
- Special events have no place here.
- No intrusive inspection (`listenerCount()`, `listeners()`).
- No `maxListeners` useless garbage.
- Only 744 bytes (minified and gzipped)

Also, there's no `removeAllListeners()`.

Okay, I lied, you CAN do `_removeAllListeners([eventName])` (underscored), but you should REALLY ONLY do that if you are the creator of the event emitter (NOT the consumer), and only if you REALLY understand the consequences and have planned accordingly. I underscored this method because API consumers should not be tempted to use it.

## One cool thing

One cool thing you can do with `JellyEmitter`, but NOT [`EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter), is the ability to wrap your event listeners in closures, but still allow the listener to be removed with the inner (unwrapped) function.

Example:
```
var original = function () {...};
var wrapper = function () {
	doSomeStuff();
	return original.apply(this, arguments)
};

wrapper.originalListener = original;
emitter.on('foo', wrapper);

// Then you can do this...
emitter.removeListener('foo', original)
```

If you give an event listener the `originalListener` property, that listener can ONLY be removed by referencing the value of `originalListener`, and NOT by referencing the function that was actually registered.

This is useful for API developers who wish to give custom functionality to some (or all) events. It allows the API consumer to still have the power to remove their listeners, even though they were wrapped by the API developer.

