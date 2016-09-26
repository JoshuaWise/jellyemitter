# jellyemitter [![Build Status](https://img.shields.io/travis/JoshuaWise/jellyemitter.svg)](https://travis-ci.org/JoshuaWise/jellyemitter)
A generic event emitter that doesn't totally suck.

## Installation

```bash
npm install --save jellyemitter
```

## Usage

```js
var JellyEmitter = require('jellyemitter')
var emitter = new JellyEmitter

emitter.on('foo', function () {console.log('foo!')})
emitter.emit('foo') // => "foo!"
```

## How is this different from the Node.js EventEmitter?

- All events are treated equally ("error", "newListener", and "removeListener" are not special)
- No intrusive inspection  with listenerCount() or listeners()
- No max listeners warning (annoying and useless)
- Only 704 bytes (minified and gzipped)

Other than that, it's basically the same. You get `emit`, `on`, `once`, `addListener`, and `removeListener`.

## Design details

#### There's no removeAllListeners()

Okay I lied. You *can* do `_removeAllListeners([eventName])` (underscored), but you should **only** do that under one of two conditions:
- You are an API developer and you **really** know what you're doing
- You are an API consumer and you **really** know what you're doing, and you **know** your code is the only code to touch that event emitter

I underscored this method because of how dangerous it is. If you don't understand why it's dangerous, you probably shouldn't be using it.

#### Inheritance

When you inherit from `JellyEmitter`, you don't have to call the `JellyEmitter` constructor. Inheriting the prototype is enough.

#### Performance

`JellyEmitter` takes advantage of smart V8 optimizations, just like [`EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter). In most cases though, you'll find it even has slightly better performance.

## Browser Support

- Chrome 5+
- Firefox 4+
- Safari 5+
- Opera 11.6+
- Internet Explorer 9+

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

*Caution:*

When you use the `.originalListener` property on a wrapped function, `JellyEmitter` can no longer disinguish between the wrapped function and the original. This means, if you add both the original **and** the wrapped listener to the `JellyEmitter`, a call to `.removeListener(eventName, original)` will just remove the first version that was added, regardless of which version you intended to remove. Therefore, if you add a wrapped listener, you should **never** allow the unwrapped version to be added (to the same event). You should also **never** add the same function wrapped in two different ways (to the same event).

In short, when you use the `.originalListener` property, you are saying "this outer function is *totally representing* the original, and no other listener will do such—not even the original—unless it is a clone of this outer function".
