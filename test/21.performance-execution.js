var expect = require('chai').expect
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
			var endTime = now() + 2000
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
	function fastEnough(a, b, forgiveness) {
		if (a > b) {
			expect(a).to.be.closeTo(b, b * forgiveness)
		}
	}
	function faster(a, b) {
		expect(a).to.be.at.most(b)
	}
	it('should wait for node stabilization before performing tests', function (done) {
		setTimeout(done, 2000)
	})
	it('should emit single event (no args) faster', function () {
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
		faster(ns(test, jelly), ns(test, node))
	})
	it('should emit double event (no args) faster', function () {
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
		faster(ns(test, jelly), ns(test, node))
	})
	it('should emit single event (1 arg) faster', function () {
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
		faster(ns(test, jelly), ns(test, node))
	})
	it('should emit double event (1 arg) faster', function () {
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
		faster(ns(test, jelly), ns(test, node))
	})
	it('should emit single event (2 args) faster', function () {
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
		faster(ns(test, jelly), ns(test, node))
	})
	it('should emit double event (2 args) faster', function () {
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
		faster(ns(test, jelly), ns(test, node))
	})
	it('should emit single event (3 args) faster', function () {
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
		faster(ns(test, jelly), ns(test, node))
	})
	it('should emit double event (3 args) faster', function () {
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
		faster(ns(test, jelly), ns(test, node))
	})
	it('should emit single event (10 args) faster', function () {
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
		faster(ns(test, jelly), ns(test, node))
	})
	it('should emit double event (10 args) faster', function () {
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
		faster(ns(test, jelly), ns(test, node))
	})
})
