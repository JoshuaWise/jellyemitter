'use strict'
var _W = {} // Private flag; a future version should use Symbols here.

function JellyEmitter() {}
JellyEmitter.prototype.emit = function (eventName) {
	var list = this._events && this._events[eventName]
	if (list) {
		var argLen = arguments.length
		if (argLen < 5) {
			argLen <= 1 ? arg0(this, list) :
			argLen == 2 ? arg1(this, list, arguments[1]) :
			argLen == 3 ? arg2(this, list, arguments[1], arguments[2]) :
			              arg3(this, list, arguments[1], arguments[2], arguments[3])
		} else {
			var args = new Array(argLen - 1)
			for (var i=1; i<argLen; i++) {args[i - 1] = arguments[i]}
			argX(this, list, args)
		}
		return true
	}
	return false
}
JellyEmitter.prototype.addListener =
JellyEmitter.prototype.on = function (eventName, listener) {
	if (typeof listener !== 'function') {
		throw TypeError('Event listener must be a function, not ' + (listener === null ? null : typeof listener) + '.')
	}
	var events = this._events || (this._events = new HashTable)
	var list = events[eventName]
	if (!list) {
		events[eventName] = listener
	} else if (typeof list === 'function') {
		events[eventName] = [list, listener]
	} else {
		list.push(listener)
	}
	return this
}
JellyEmitter.prototype.once = function (eventName, listener) {
	if (typeof listener !== 'function') {
		throw TypeError('Event listener must be a function, not ' + (listener === null ? null : typeof listener) + '.')
	}
	var notFired = 1
	function w() {
		if (notFired) {
			notFired = 0
			this.removeListener(eventName, w)
			listener.apply(this, arguments)
		}
	}
	w.originalListener = listener.originalListener || listener
	w._W = _W
	return this.on(eventName, w)
}
JellyEmitter.prototype.removeListener = function (eventName, listener) {
	if (typeof listener !== 'function') {
		throw TypeError('Event listener must be a function, not ' + (listener === null ? null : typeof listener) + '.')
	}
	var events = this._events
	if (events) {
		var list = events[eventName]
		if (listener._W === _W) {
			listener.originalListener = undefined
		}
		if (typeof list === 'function') {
			if (list.originalListener ? list.originalListener === listener : list === listener) {
				delete events[eventName]
			}
		} else if (list) {
			for (var i=0, len=list.length; i<len; i++) {
				var item = list[i]
				if (item.originalListener ? item.originalListener === listener : item === listener) {
					len === 2 ? (events[eventName] = list[i ? 0 : 1]) : rm(list, i)
					break
				}
			}
		}
	}
	return this
}
JellyEmitter.prototype._removeAllListeners = function (eventName) {
	var events = this._events
	if (events) {
		if (arguments.length) {
			events[eventName] && delete events[eventName]
		} else {
			this._events = undefined
		}
	}
	return this
}
module.exports = JellyEmitter

function arg0(self, handler) {
	if (typeof handler === 'function') {
		handler.call(self)
	} else {
		var listeners = cp(handler)
		for (var i=0, len=listeners.length; i<len; i++) {
			listeners[i].call(self)
		}
	}
}

function arg1(self, handler) {
	if (typeof handler === 'function') {
		handler.call(self, arguments[2])
	} else {
		var listeners = cp(handler)
		for (var i=0, len=listeners.length; i<len; i++) {
			listeners[i].call(self, arguments[2])
		}
	}
}

function arg2(self, handler) {
	if (typeof handler === 'function') {
		handler.call(self, arguments[2], arguments[3])
	} else {
		var listeners = cp(handler)
		for (var i=0, len=listeners.length; i<len; i++) {
			listeners[i].call(self, arguments[2], arguments[3])
		}
	}
}

function arg3(self, handler) {
	if (typeof handler === 'function') {
		handler.call(self, arguments[2], arguments[3], arguments[4])
	} else {
		var listeners = cp(handler)
		for (var i=0, len=listeners.length; i<len; i++) {
			listeners[i].call(self, arguments[2], arguments[3], arguments[4])
		}
	}
}

function argX(self, handler) {
	if (typeof handler === 'function') {
		handler.apply(self, arguments[2])
	} else {
		var listeners = cp(handler)
		for (var i=0, len=listeners.length; i<len; i++) {
			listeners[i].apply(self, arguments[2])
		}
	}
}

// Faster than invoking arr.slice().
function cp(arr) {
	var len = arr.length
	var ret = new Array(len)
	for (var i=0; i<len; i++) {ret[i] = arr[i]}
	return ret
}

// Faster than invoking arr.splice(index, 1).
function rm(arr, index) {
	var len = arr.length
	for (var i=index+1; i<len; i++) {arr[i - 1] = arr[i]}
	arr.pop()
}

// Instantiating this is faster than just invoking Object.create(null).
function HashTable() {}
HashTable.prototype = Object.create(null)

