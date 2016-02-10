# jellyemitter
A generic event emitter that doesn't totally suck.

## How is this different from the Node.js EventEmitter?

- All events are treated equally (`error`, `newListener`, and `removeListener` are not special)
- No intrusive inspection  with `listenerCount()` or `listeners()`
- No `maxListeners` (annoying and useless)
- Only 744 bytes (minified and gzipped)

Also, there's no `removeAllListeners()`.

Okay I lied. You **can** do `_removeAllListeners([eventName])` (underscored), but you should **only** do that if you are the creator of the event emitter (**not** the consumer), and only if you **really** understand the consequences and have planned accordingly. I underscored this method because API consumers should not be tempted to use it.

## One cool thing

One cool thing you can do with `JellyEmitter`, but **not** [`EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter), is the ability to wrap your event listeners in closures, but still allow the listener to be removed with the inner (unwrapped) function.

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

If you give an event listener the `originalListener` property, that listener can **only** be removed by referencing the value of `originalListener`, and **not** by referencing the function that was actually registered.

This is useful for API developers who wish to give custom functionality to some (or all) events. It allows the API consumer to still have the power to remove their listeners, even though they were wrapped by the API developer.

