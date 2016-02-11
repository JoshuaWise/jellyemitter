var expect = require('chai').expect
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
	JellyEmitter.prototype.removeAllListeners = JellyEmitter.prototype._removeAllListeners
	it('should wait for node stabilization before performing tests', function (done) {
		setTimeout(done, 2000)
	})
	it('should be created faster', function () {
		this.timeout(400000); this.slow(400000)
		function jelly() {
			var foo = new JellyEmitter
		}
		function node() {
			var foo = new EventEmitter
		}
		faster(ns(jelly), ns(node))
	})
	it('should add first listener within 50%', function () {
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
		fastEnough(ns(test, jelly), ns(test, node), 0.5)
	})
	it('should add second listener faster', function () {
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
		faster(ns(test, jelly), ns(test, node))
	})
	it('should add third listener faster', function () {
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
		faster(ns(test, jelly), ns(test, node))
	})
	it('should add first listener of event faster', function () {
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
		faster(ns(test, jelly), ns(test, node))
	})
	it('should add second listener of event faster', function () {
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
		faster(ns(test, jelly), ns(test, node))
	})
	it('should add third listener of event faster', function () {
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
		faster(ns(test, jelly), ns(test, node))
	})
	it('should remove first listener within 350%', function () {
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
		fastEnough(ns(test, jelly), ns(test, node), 3.5)
	})
	it('should remove second listener faster', function () {
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
		faster(ns(test, jelly), ns(test, node))
	})
	it('should remove third listener with 350%', function () {
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
		fastEnough(ns(test, jelly), ns(test, node), 3.5)
	})
	it('should remove first listener of event faster', function () {
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
		faster(ns(test, jelly), ns(test, node))
	})
	it('should remove second listener of event faster', function () {
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
		faster(ns(test, jelly), ns(test, node))
	})
	it('should remove third listener within 350%', function () {
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
		fastEnough(ns(test, jelly), ns(test, node), 3.5)
	})
	it('should remove all listeners (none) faster', function () {
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
		faster(ns(test, jelly), ns(test, node))
	})
	it('should remove all listeners (one) faster', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('foo', noop)
		}
		function node() {
			emitter = new EventEmitter().on('foo', noop)
		}
		function test() {
			emitter.removeAllListeners()
		}
		faster(ns(test, jelly), ns(test, node))
	})
	it('should remove all listeners (many) faster', function () {
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
		faster(ns(test, jelly), ns(test, node))
	})
	it('should remove all listeners (one) of only event within 350%', function () {
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
		fastEnough(ns(test, jelly), ns(test, node), 3.5)
	})
	it('should remove all listeners (many) of only event within 350%', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('foo', noop).on('foo', noop)
		}
		function node() {
			emitter = new EventEmitter().on('foo', noop).on('foo', noop)
		}
		function test() {
			emitter.removeAllListeners('foo')
		}
		fastEnough(ns(test, jelly), ns(test, node), 3.5)
	})
	it('should remove all listeners (one) of event faster', function () {
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
		faster(ns(test, jelly), ns(test, node))
	})
	it('should remove all listeners (many) of event faster', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('bar', noop).on('foo', noop).on('foo', noop)
		}
		function node() {
			emitter = new EventEmitter().on('bar', noop).on('foo', noop).on('foo', noop)
		}
		function test() {
			emitter.removeAllListeners('foo')
		}
		faster(ns(test, jelly), ns(test, node))
	})
	it('should allocate first once() within 50%', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter()
		}
		function node() {
			emitter = new EventEmitter()
		}
		function test() {
			emitter.once('foo', noop)
		}
		fastEnough(ns(test, jelly), ns(test, node), 0.5)
	})
	it('should allocate second once() faster', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('foo', noop)
		}
		function node() {
			emitter = new EventEmitter().on('foo', noop)
		}
		function test() {
			emitter.once('foo', noop)
		}
		faster(ns(test, jelly), ns(test, node))
	})
	it('should allocate third once() faster', function () {
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
		faster(ns(test, jelly), ns(test, node))
	})
	it('should allocate first once() of event faster', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('bar', noop)
		}
		function node() {
			emitter = new EventEmitter().on('bar', noop)
		}
		function test() {
			emitter.once('foo', noop)
		}
		faster(ns(test, jelly), ns(test, node))
	})
	it('should allocate second once() of event faster', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('bar', noop).on('foo', noop)
		}
		function node() {
			emitter = new EventEmitter().on('bar', noop).on('foo', noop)
		}
		function test() {
			emitter.once('foo', noop)
		}
		faster(ns(test, jelly), ns(test, node))
	})
	it('should allocate third once() of event faster', function () {
		this.timeout(400000); this.slow(400000)
		var emitter
		function jelly() {
			emitter = new JellyEmitter().on('bar', noop).on('foo', noop).on('foo', noop)
		}
		function node() {
			emitter = new EventEmitter().on('bar', noop).on('foo', noop).on('foo', noop)
		}
		function test() {
			emitter.once('foo', noop)
		}
		faster(ns(test, jelly), ns(test, node))
	})
})
