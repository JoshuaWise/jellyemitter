var expect = require('chai').expect
var clc = require('cli-color')
var JellyEmitter = require('../.')
var EventEmitter = require('events')
var isRemoteTest = process.env.CI || typeof zuul_msg_bus !== 'undefined'

isRemoteTest || describe('performance (allocation)', function () {
	var ns = (function (hrtime, now, round) {
		function noop() {}
		function sum (a, b) {return a + b}
		return function (fn, setup) {
			setup = setup || noop
			var times = []
			var endTime = now() + 500
			do {
				setup()
				var t1 = hrtime()
				fn()
				var td = hrtime(t1)
				times.push(td[0] * 1e9 + td[1])
			} while (now() < endTime)
			return round(times.reduce(sum, 0) / times.length)
		}
	}(process.hrtime, Date.now, Math.round))
	function noop() {}
	function repeat(str, n) {
		var ret = ''
		for (var i=0; i<n; i++) {ret += str}
		return ret
	}
	function logPerf(a, b) {
		var diff = a - b
		var variation = diff / b
		var bar = repeat('\u2013', 63) + '\u21b5 '
		var nanoseconds = (diff < 0 ? '' : '+') + diff
		var percent = (variation < 0 ? '' : '+') + Math.round(variation * 100) + '%'
		var tab = repeat(' ', 80 - bar.length - nanoseconds.length - percent.length)
		var color = diff < 0 ? clc.green : (diff < 10 || variation < 0.1) ? clc.white : clc.red
		console.log(bar + color(percent + tab + nanoseconds))
	}
	
	JellyEmitter.prototype.removeAllListeners = JellyEmitter.prototype._removeAllListeners
	it('waiting for node stabilization before performing tests...', function (done) {
		this.timeout(400000); this.slow(400000)
		setTimeout(done, 2000)
	})
	it('new instance', function () {
		this.timeout(400000); this.slow(400000)
		function jelly() {
			var foo = new JellyEmitter
		}
		function node() {
			var foo = new EventEmitter
		}
		logPerf(ns(jelly), ns(node))
	})
	it('adding first listener', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter()
		}
		function node() {
			emitter = new EventEmitter()
		}
		function test() {
			emitter.on('foo', noop)
		}
		logPerf(ns(test, jelly), ns(test, node))
	})
	it('adding second listener', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('foo', noop)
		}
		function node() {
			emitter = new EventEmitter().on('foo', noop)
		}
		function test() {
			emitter.on('foo', noop)
		}
		logPerf(ns(test, jelly), ns(test, node))
	})
	it('adding third listener', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('foo', noop).on('foo', noop)
		}
		function node() {
			emitter = new EventEmitter().on('foo', noop).on('foo', noop)
		}
		function test() {
			emitter.on('foo', noop)
		}
		logPerf(ns(test, jelly), ns(test, node))
	})
	it('adding first listener of second event', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('bar', noop)
		}
		function node() {
			emitter = new EventEmitter().on('bar', noop)
		}
		function test() {
			emitter.on('foo', noop)
		}
		logPerf(ns(test, jelly), ns(test, node))
	})
	it('adding second listener of second event', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('bar', noop).on('foo', noop)
		}
		function node() {
			emitter = new EventEmitter().on('bar', noop).on('foo', noop)
		}
		function test() {
			emitter.on('foo', noop)
		}
		logPerf(ns(test, jelly), ns(test, node))
	})
	it('adding third listener of second event', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('bar', noop).on('foo', noop).on('foo', noop)
		}
		function node() {
			emitter = new EventEmitter().on('bar', noop).on('foo', noop).on('foo', noop)
		}
		function test() {
			emitter.on('foo', noop)
		}
		logPerf(ns(test, jelly), ns(test, node))
	})
	it('removing only listener', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('foo', noop)
		}
		function node() {
			emitter = new EventEmitter().on('foo', noop)
		}
		function test() {
			emitter.removeListener('foo', noop)
		}
		logPerf(ns(test, jelly), ns(test, node))
	})
	it('removing second listener', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('foo', noop).on('foo', noop)
		}
		function node() {
			emitter = new EventEmitter().on('foo', noop).on('foo', noop)
		}
		function test() {
			emitter.removeListener('foo', noop)
		}
		logPerf(ns(test, jelly), ns(test, node))
	})
	it('removing third listener', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('foo', noop).on('foo', noop).on('foo', noop)
		}
		function node() {
			emitter = new EventEmitter().on('foo', noop).on('foo', noop).on('foo', noop)
		}
		function test() {
			emitter.removeListener('foo', noop)
		}
		logPerf(ns(test, jelly), ns(test, node))
	})
	it('removing only listener of second event', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('foo', noop).on('bar', noop)
		}
		function node() {
			emitter = new EventEmitter().on('foo', noop).on('bar', noop)
		}
		function test() {
			emitter.removeListener('foo', noop)
		}
		logPerf(ns(test, jelly), ns(test, node))
	})
	it('removing second listener of second event', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('foo', noop).on('foo', noop).on('bar', noop)
		}
		function node() {
			emitter = new EventEmitter().on('foo', noop).on('foo', noop).on('bar', noop)
		}
		function test() {
			emitter.removeListener('foo', noop)
		}
		logPerf(ns(test, jelly), ns(test, node))
	})
	it('removing third listener of second event', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('foo', noop).on('foo', noop).on('foo', noop).on('bar', noop)
		}
		function node() {
			emitter = new EventEmitter().on('foo', noop).on('foo', noop).on('foo', noop).on('bar', noop)
		}
		function test() {
			emitter.removeListener('foo', noop)
		}
		logPerf(ns(test, jelly), ns(test, node))
	})
	it('removing all listeners (none)', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter()
		}
		function node() {
			emitter = new EventEmitter()
		}
		function test() {
			emitter.removeAllListeners()
		}
		logPerf(ns(test, jelly), ns(test, node))
	})
	it('removing all listeners (many)', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('foo', noop).on('bar', noop).on('bar', noop)
		}
		function node() {
			emitter = new EventEmitter().on('foo', noop).on('bar', noop).on('bar', noop)
		}
		function test() {
			emitter.removeAllListeners()
		}
		logPerf(ns(test, jelly), ns(test, node))
	})
	it('removing the only event name', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('foo', noop)
		}
		function node() {
			emitter = new EventEmitter().on('foo', noop)
		}
		function test() {
			emitter.removeAllListeners('foo')
		}
		logPerf(ns(test, jelly), ns(test, node))
	})
	it('removing an event name, of multiple', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('bar', noop).on('foo', noop)
		}
		function node() {
			emitter = new EventEmitter().on('bar', noop).on('foo', noop)
		}
		function test() {
			emitter.removeAllListeners('foo')
		}
		logPerf(ns(test, jelly), ns(test, node))
	})
	it('adding a once() event', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('foo', noop).on('foo', noop)
		}
		function node() {
			emitter = new EventEmitter().on('foo', noop).on('foo', noop)
		}
		function test() {
			emitter.once('foo', noop)
		}
		logPerf(ns(test, jelly), ns(test, node))
	})
	it('removing a once() event', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('bar', noop).once('foo', noop)
		}
		function node() {
			emitter = new EventEmitter().on('bar', noop).once('foo', noop)
		}
		function test() {
			emitter.removeListener('foo', noop)
		}
		logPerf(ns(test, jelly), ns(test, node))
	})
})
