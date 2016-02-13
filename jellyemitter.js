'use strict'

function JellyEmitter() {}
JellyEmitter.prototype = {
	emit: function (eventName) {
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
		// This current implementation could cause event order to be changed in edge cases:
		// emitter.on('foo', bar)
		// emitter.on('foo', quux)
		// emitter.once('foo', bar)
		// emitter.emit('foo') // Event order: bar, quux, bar
		// emitter.emit('foo') // Event order: quux, bar
		var fired = false
		function w() {
			if (!fired) {
				this.removeListener(eventName, w.originalListener)
				fired = true
			}
			listener.apply(this, arguments)
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
					var item = list[i]
					if (item.originalListener ? item.originalListener === listener : item === listener) {
						len === 2 ? (events[eventName] = list[i ? 0 : 1]) : list.splice(i, 1)
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
				this._events = undefined
			}
		}
		return this
	}
}
JellyEmitter.prototype.addListener = JellyEmitter.prototype.on
module.exports = JellyEmitter

function a0(self, handler) {
	if (typeof handler === 'function') {
		handler.call(self)
	} else {
		var listeners = cp(handler)
		for (var i=0, len=listeners.length; i<len; i++) {
			listeners[i].call(self)
		}
	}
}

function a1(self, handler) {
	if (typeof handler === 'function') {
		handler.call(self, arguments[2])
	} else {
		var listeners = cp(handler)
		for (var i=0, len=listeners.length; i<len; i++) {
			listeners[i].call(self, arguments[2])
		}
	}
}

function a2(self, handler) {
	if (typeof handler === 'function') {
		handler.call(self, arguments[2], arguments[3])
	} else {
		var listeners = cp(handler)
		for (var i=0, len=listeners.length; i<len; i++) {
			listeners[i].call(self, arguments[2], arguments[3])
		}
	}
}

function a3(self, handler) {
	if (typeof handler === 'function') {
		handler.call(self, arguments[2], arguments[3], arguments[4])
	} else {
		var listeners = cp(handler)
		for (var i=0, len=listeners.length; i<len; i++) {
			listeners[i].call(self, arguments[2], arguments[3], arguments[4])
		}
	}
}

function aX(self, handler) {
	if (typeof handler === 'function') {
		handler.apply(self, arguments[2])
	} else {
		var listeners = cp(handler)
		for (var i=0, len=listeners.length; i<len; i++) {
			listeners[i].apply(self, arguments[2])
		}
	}
}

function cp(arr) {
	var len = arr.length
	var ret = new Array(len)
	for (var i=0; i<len; i++) {ret[i] = arr[i]}
	return ret
}
