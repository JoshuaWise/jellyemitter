var expect = require('chai').expect
var clc = require('cli-color')
var JellyEmitter = require('../.')
var EventEmitter = require('events')
var isRemoteTest = process.env.CI || typeof zuul_msg_bus !== 'undefined'

isRemoteTest || describe('performance (execution)', function () {
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
	
	it('waiting for node stabilization before performing tests...', function (done) {
		this.timeout(400000); this.slow(400000)
		setTimeout(done, 2000)
	})
	it('emitting single event (no args)', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('foo', noop)
		}
		function node() {
			emitter = new EventEmitter().on('foo', noop)
		}
		function test() {
			emitter.emit('foo')
		}
		logPerf(ns(test, jelly), ns(test, node))
	})
	it('emitting single event (1 arg)', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('foo', noop)
		}
		function node() {
			emitter = new EventEmitter().on('foo', noop)
		}
		function test() {
			emitter.emit('foo', 'bar')
		}
		logPerf(ns(test, jelly), ns(test, node))
	})
	it('emitting single event (2 args)', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('foo', noop)
		}
		function node() {
			emitter = new EventEmitter().on('foo', noop)
		}
		function test() {
			emitter.emit('foo', 'bar', 'baz')
		}
		logPerf(ns(test, jelly), ns(test, node))
	})
	it('emitting single event (3 args)', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('foo', noop)
		}
		function node() {
			emitter = new EventEmitter().on('foo', noop)
		}
		function test() {
			emitter.emit('foo', 'bar', 'baz', 'quax')
		}
		logPerf(ns(test, jelly), ns(test, node))
	})
	it('emitting single event (10 args)', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('foo', noop)
		}
		function node() {
			emitter = new EventEmitter().on('foo', noop)
		}
		function test() {
			emitter.emit('foo', 'bar', 'baz', 'quax', 4, 5, 6, 7, 8, 9, 10)
		}
		logPerf(ns(test, jelly), ns(test, node))
	})
	it('emitting double event (no args)', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('foo', noop).on('foo', noop)
		}
		function node() {
			emitter = new EventEmitter().on('foo', noop).on('foo', noop)
		}
		function test() {
			emitter.emit('foo')
		}
		logPerf(ns(test, jelly), ns(test, node))
	})
	it('emitting double event (1 arg)', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('foo', noop).on('foo', noop)
		}
		function node() {
			emitter = new EventEmitter().on('foo', noop).on('foo', noop)
		}
		function test() {
			emitter.emit('foo', 'bar')
		}
		logPerf(ns(test, jelly), ns(test, node))
	})
	it('emitting double event (2 args)', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('foo', noop).on('foo', noop)
		}
		function node() {
			emitter = new EventEmitter().on('foo', noop).on('foo', noop)
		}
		function test() {
			emitter.emit('foo', 'bar', 'baz')
		}
		logPerf(ns(test, jelly), ns(test, node))
	})
	it('emitting double event (3 args)', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('foo', noop).on('foo', noop)
		}
		function node() {
			emitter = new EventEmitter().on('foo', noop).on('foo', noop)
		}
		function test() {
			emitter.emit('foo', 'bar', 'baz', 'quax')
		}
		logPerf(ns(test, jelly), ns(test, node))
	})
	it('emitting double event (10 args)', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('foo', noop).on('foo', noop)
		}
		function node() {
			emitter = new EventEmitter().on('foo', noop).on('foo', noop)
		}
		function test() {
			emitter.emit('foo', 'bar', 'baz', 'quax', 4, 5, 6, 7, 8, 9, 10)
		}
		logPerf(ns(test, jelly), ns(test, node))
	})
})
