'use strict'
var W = {} // Private flag

function JellyEmitter() {}
JellyEmitter.prototype.emit = function (eventName) {
	var list = this._events && this._events[eventName]
	if (list) {
		var argLen = arguments.length
		if (argLen < 5) {
			argLen <= 1 ? a0(this, list) :
			argLen == 2 ? a1(this, list, arguments[1]) :
			argLen == 3 ? a2(this, list, arguments[1], arguments[2]) :
			              a3(this, list, arguments[1], arguments[2], arguments[3])
		} else {
			var args = new Array(argLen - 1)
			for (var i=1; i<argLen; i++) {args[i - 1] = arguments[i]}
			aX(this, list, args)
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
	var events = this._events || (this._events = Object.create(null))
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
	w.W = W
	return this.on(eventName, w)
}
JellyEmitter.prototype.removeListener = function (eventName, listener) {
	if (typeof listener !== 'function') {
		throw TypeError('Event listener must be a function, not ' + (listener === null ? null : typeof listener) + '.')
	}
	var events = this._events
	if (events) {
		var list = events[eventName]
		if (listener.W === W) {
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
					len === 2 ? (events[eventName] = list[i ? 0 : 1]) : list.splice(i, 1)
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

function a0(self, handler) {
	if (typeof handler === 'function') {
		handler.call(self)
	} else {
		var listeners = c(handler)
		for (var i=0, len=listeners.length; i<len; i++) {
			listeners[i].call(self)
		}
	}
}

function a1(self, handler) {
	if (typeof handler === 'function') {
		handler.call(self, arguments[2])
	} else {
		var listeners = c(handler)
		for (var i=0, len=listeners.length; i<len; i++) {
			listeners[i].call(self, arguments[2])
		}
	}
}

function a2(self, handler) {
	if (typeof handler === 'function') {
		handler.call(self, arguments[2], arguments[3])
	} else {
		var listeners = c(handler)
		for (var i=0, len=listeners.length; i<len; i++) {
			listeners[i].call(self, arguments[2], arguments[3])
		}
	}
}

function a3(self, handler) {
	if (typeof handler === 'function') {
		handler.call(self, arguments[2], arguments[3], arguments[4])
	} else {
		var listeners = c(handler)
		for (var i=0, len=listeners.length; i<len; i++) {
			listeners[i].call(self, arguments[2], arguments[3], arguments[4])
		}
	}
}

function aX(self, handler) {
	if (typeof handler === 'function') {
		handler.apply(self, arguments[2])
	} else {
		var listeners = c(handler)
		for (var i=0, len=listeners.length; i<len; i++) {
			listeners[i].apply(self, arguments[2])
		}
	}
}

function c(arr) {
	var len = arr.length
	var ret = new Array(len)
	for (var i=0; i<len; i++) {ret[i] = arr[i]}
	return ret
}
