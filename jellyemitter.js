'use strict'

function JellyEmitter() {}
JellyEmitter.prototype = {
	emit: function (eventName, a, b, c) {
		var list = this._events && this._events[eventName]
		if (list) {
			var argLen = arguments.length
			argLen <= 1 ? arg0(this, list) :
			argLen == 2 ? arg1(this, list, a) :
			argLen == 3 ? arg2(this, list, a, b) :
			argLen == 4 ? arg3(this, list, a, b, c) :
			              argX(this, list, copy(arguments, 1))
			return true
		}
		return false
	},
	on: function (eventName, listener) {
		if (typeof listener !== 'function') {
			throw new TypeError('Event listener must be a function, not ' + (listener === null ? null : typeof listener) + '.')
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
	},
	once: function (eventName, listener) {
		if (typeof listener !== 'function') {
			throw new TypeError('Event listener must be a function, not ' + (listener === null ? null : typeof listener) + '.')
		}
		var fired = false
		function w() {
			this.removeListener(eventName, w.originalListener)
			if (!fired) {
				fired = true
				listener.apply(this, arguments)
			}
		}
		w.originalListener = listener.originalListener || listener
		return this.on(eventName, w)
	},
	removeListener: function (eventName, listener) {
		if (typeof listener !== 'function') {
			throw new TypeError('Event listener must be a function, not ' + (listener === null ? null : typeof listener) + '.')
		}
		var events = this._events
		if (events) {
			var list = events[eventName]
			if (typeof list === 'function') {
				if (list.originalListener ? list.originalListener === listener : list === listener) {
					delete events[eventName]
				}
			} else if (list) {
				for (var i=0, len=list.length; i<len; i++) {
					if (list[i].originalListener ? list[i].originalListener === listener : list[i] === listener) {
						len === 2 ? (events[eventName] = list[+!i]) : list.splice(i, 1)
						break
					}
				}
			}
		}
		return this
	},
	_removeAllListeners: function (eventName) {
		var events = this._events
		if (events) {
			if (arguments.length) {
				events[eventName] && delete events[eventName]
			} else {
				delete this._events
			}
		}
		return this
	}
}
JellyEmitter.prototype.addListener = JellyEmitter.prototype.on
module.exports = JellyEmitter

function arg0(self, handler) {
	if (typeof handler === 'function') {
		handler.call(self)
	} else {
		var listeners = copy(handler, 0)
		for (var i=0, len=listeners.length; i<len; i++) {
			listeners[i].call(self)
		}
	}
}

function arg1(self, handler, a) {
	if (typeof handler === 'function') {
		handler.call(self, a)
	} else {
		var listeners = copy(handler, 0)
		for (var i=0, len=listeners.length; i<len; i++) {
			listeners[i].call(self, a)
		}
	}
}

function arg2(self, handler, a, b) {
	if (typeof handler === 'function') {
		handler.call(self, a, b)
	} else {
		var listeners = copy(handler, 0)
		for (var i=0, len=listeners.length; i<len; i++) {
			listeners[i].call(self, a, b)
		}
	}
}

function arg3(self, handler, a, b, c) {
	if (typeof handler === 'function') {
		handler.call(self, a, b, c)
	} else {
		var listeners = copy(handler, 0)
		for (var i=0, len=listeners.length; i<len; i++) {
			listeners[i].call(self, a, b, c)
		}
	}
}

function argX(self, handler, args) {
	if (typeof handler === 'function') {
		handler.apply(self, args)
	} else {
		var listeners = copy(handler, 0)
		for (var i=0, len=listeners.length; i<len; i++) {
			listeners[i].apply(self, args)
		}
	}
}

function copy(arr, start) {
	var len = arr.length - start;
	var ret = new Array(len);
	for (var i=0; i<len; i++) {ret[i] = arr[i + start];}
	return ret;
}
