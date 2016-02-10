# jellyemitter
A generic event emitter that doesn't totally suck.

```
var JellyEmitter = require('jellyemitter')
var emitter = new JellyEmitter

emitter.on('foo', function () {console.log('foo!')})
emitter.emit('foo') // => "foo!"
```

## How is this different from the Node.js EventEmitter?

- All events are treated equally ("error", "newListener", and "removeListener" are not special)
- No intrusive inspection  with listenerCount() or listeners()
- No max listeners (annoying and useless)
- Only 744 bytes (minified and gzipped)
- `emitter.emit('hasOwnProperty', 'foobar')` treats "hasOwnProperty" like an actual event (unlike literally every other event emitter in existence)

Other than that, it's basically the same. You get `emit`, `on`, `once`, `addListener`, and `removeListener`.

## Other differences

##### There's no removeAllListeners()

Okay I lied. You *can* do `_removeAllListeners([eventName])` (underscored), but you should **only** do that if you are the creator of the event emitter (**not** the consumer), and only if you **really** understand the consequences and have planned accordingly. I underscored this method because API consumers should not be tempted to use it.

##### Inheritance

When you inherit from `JellyEmitter`, you don't have to call the `JellyEmitter` constructor. Inheriting the prototype is enough.

## Super-Secret Trick (for API developers)

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

If you give an event listener the `.originalListener` property, that listener can **only** be removed by referencing the value of `.originalListener`, and **not** by referencing the function that was actually registered.

This is useful for API developers who wish to give custom functionality to some (or all) events. It allows the API consumer to still have the power to remove their listeners, even though they were wrapped by the API developer.

