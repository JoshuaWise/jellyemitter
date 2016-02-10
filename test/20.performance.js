var expect = require('chai').expect
var JellyEmitter = require('../.')
var EventEmitter = require('events')

describe('performance', function () {
	if (typeof process === 'undefined' || process.browser) {
		return
	}
	var noop = function () {}
	var ns = (function (now, hrtime) {
		var noop = function () {}
		var sum = function (a, b) {return a + b}
		return function test(fn, setup) {
			setup = setup || noop
			var times = []
			var endTime = now() + 1000
			do {
				setup()
				var t1 = hrtime()
				fn()
				var td = hrtime(t1)
				times.push(td[0] * 1e9 + td[1])
			} while (now() < endTime)
			return Math.round(times.reduce(sum, 0) / times.length)
		}
	}(Date.now, process.hrtime))
	
	function fastEnough(time, target, acceptance) {
		if (time > target) {
			expect(time).to.be.closeTo(target, target * (acceptance || 0))
		}
	}
	
	it('should be created fast enough (within 10%)', function () {
		this.timeout(3000)
		this.slow(25000)
		function jelly() {
			var foo = new JellyEmitter
		}
		function node() {
			var foo = new EventEmitter
		}
		fastEnough(ns(jelly), ns(node), 0.1)
	})
	it('should add listeners fast enough (within 25%)', function () {
		this.timeout(3000)
		this.slow(25000)
		var j, n
		function setupJ() {
			j = new JellyEmitter
		}
		function setupN() {
			n = new EventEmitter
		}
		function jelly() {
			j.on('foo', noop).on('foo', noop).on('foo', noop)
		}
		function node() {
			n.on('foo', noop).on('foo', noop).on('foo', noop)
		}
		fastEnough(ns(jelly, setupJ), ns(node, setupN), 0.25)
	})
	it('should add/remove once fast enough (within 25%)', function () {
		this.timeout(3000)
		this.slow(25000)
		var j, n
		function setupJ() {
			j = new JellyEmitter().on('bar', noop)
		}
		function setupN() {
			n = new EventEmitter().on('bar', noop)
		}
		function jelly() {
			j.once('foo', noop).once('foo', noop).once('foo', noop)
			j.emit('foo')
		}
		function node() {
			n.once('foo', noop).once('foo', noop).once('foo', noop)
			n.emit('foo')
		}
		fastEnough(ns(jelly, setupJ), ns(node, setupN), 0.25)
	})
	it('should emit single listeners fast enough (within 25%)', function () {
		this.timeout(3000)
		this.slow(25000)
		var j, n
		function setupJ() {
			j = new JellyEmitter().on('foo', noop)
		}
		function setupN() {
			n = new EventEmitter().on('foo', noop)
		}
		function jelly() {
			j.emit('foo')
			j.emit('foo', 1)
			j.emit('foo', 1, 'str', null, {})
		}
		function node() {
			n.emit('foo')
			n.emit('foo', 1)
			n.emit('foo', 1, 'str', null, {})
		}
		fastEnough(ns(jelly, setupJ), ns(node, setupN), 0.25)
	})
	it('should emit multiple listeners fast enough (within 25%)', function () {
		this.timeout(3000)
		this.slow(25000)
		var j, n
		function setupJ() {
			j = new JellyEmitter().on('foo', noop).on('foo', noop).on('foo', noop)
		}
		function setupN() {
			n = new EventEmitter().on('foo', noop).on('foo', noop).on('foo', noop)
		}
		function jelly() {
			j.emit('foo')
			j.emit('foo', 1)
			j.emit('foo', 1, 'str', null, {})
		}
		function node() {
			n.emit('foo')
			n.emit('foo', 1)
			n.emit('foo', 1, 'str', null, {})
		}
		fastEnough(ns(jelly, setupJ), ns(node, setupN), 0.25)
	})
	it('should removeAllListeners fast enough (within 50%)', function () {
		this.timeout(3000)
		this.slow(25000)
		var j, n
		function setupJ() {
			j = new JellyEmitter().on('foo', noop).on('bar', noop).on('bar', noop)
		}
		function setupN() {
			n = new EventEmitter().on('foo', noop).on('bar', noop).on('bar', noop)
		}
		function jelly() {
			j._removeAllListeners()
		}
		function node() {
			n.removeAllListeners()
		}
		fastEnough(ns(jelly, setupJ), ns(node, setupN), 0.5)
	})
})
