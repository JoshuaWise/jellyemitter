var expect = require('chai').expect
var JellyEmitter = require('../.')

describe('JellyEmitter', function () {
	var a = 0
	var b = 0
	function incA() {a++}
	function incB() {b++}
	function noop() {}
	beforeEach(function () {a = 0; b = 0})
	
	var emitter = new JellyEmitter
	
	it('should return self', function () {
		var foo = new JellyEmitter
		expect(foo.on('bar', noop)).to.equal(foo)
		expect(foo.removeListener('bar', noop)).to.equal(foo)
		expect(foo.once('bar', noop)).to.equal(foo)
		expect(foo._removeAllListeners('bar')).to.equal(foo)
		expect(foo._removeAllListeners()).to.equal(foo)
	})
	it('should throw on invalid input', function () {
		var foo = new JellyEmitter
		function on() {foo.on('bar', true)}
		function once() {foo.once('bar', 'baz')}
		function removeListener() {foo.removeListener('bar', {})}
		expect(on).to.throw(TypeError)
		expect(once).to.throw(TypeError)
		expect(removeListener).to.throw(TypeError)
	})
	it('should emit one time', function () {
		emitter.on('a', incA)
		emitter.emit('a')
		expect(a).to.equal(1)
	})
	it('should emit two times', function () {
		emitter.on('a', incA)
		emitter.removeListener('a', incB)
		emitter.removeListener('b', incA)
		emitter._removeAllListeners('c')
		emitter.emit('a')
		expect(a).to.equal(2)
	})
	it('should emit both twice', function () {
		emitter.on('b', incB)
		emitter.emit('a')
		emitter.emit('b')
		emitter.emit('b')
		expect(a).to.equal(2)
		expect(b).to.equal(2)
	})
	it('should emit a once, b twice', function () {
		emitter.on('b', incB)
		emitter.removeListener('a', incA)
		emitter.emit('a')
		emitter.emit('b')
		expect(a).to.equal(1)
		expect(b).to.equal(2)
	})
	it('should emit a, not b', function () {
		emitter._removeAllListeners('b')
		emitter.emit('a')
		emitter.emit('b')
		expect(a).to.equal(1)
		expect(b).to.equal(0)
	})
	it('should not emit anything', function () {
		emitter.on('a', incA)
		emitter.on('b', incB)
		emitter._removeAllListeners()
		emitter.emit('a')
		emitter.emit('b')
		expect(a).to.equal(0)
		expect(b).to.equal(0)
	})
	it('should emit once', function () {
		emitter.once('a', incA)
		emitter.emit('a')
		emitter.emit('a')
		expect(a).to.equal(1)
	})
	it('should emit wrapper two times', function () {
		function wrapper() {
			incA.apply(this, arguments)
		}
		wrapper.originalListener = incA
		emitter.on('a', wrapper)
		emitter.emit('a')
		emitter.emit('a')
		emitter.removeListener('a', incA)
		emitter.emit('a')
		expect(a).to.equal(2)
	})
	it('should emit wrapper once', function () {
		function wrapper() {
			incA.apply(this, arguments)
		}
		wrapper.originalListener = incA
		emitter.once('a', wrapper)
		emitter.emit('a')
		emitter.emit('a')
		expect(a).to.equal(1)
	})
	it('should be a proper map', function () {
		var foo = new JellyEmitter
		foo.bar = true
		expect(foo.emit('hasOwnProperty', 'bar')).to.be.false
		foo.on('hasOwnProperty', incA)
		foo.emit('hasOwnProperty')
		expect(a).to.equal(1)
	})
	it('should emit no args', function () {
		var foo = new JellyEmitter
		foo.on('bar', function () {
			expect(arguments.length).to.equal(0)
		})
		foo.emit('bar')
	})
	it('should emit one arg', function () {
		var foo = new JellyEmitter
		foo.on('bar', function (baz) {
			expect(arguments.length).to.equal(1)
			expect(baz).to.equal('baz')
		})
		foo.emit('bar', 'baz')
	})
	it('should emit two args', function () {
		var foo = new JellyEmitter
		foo.on('bar', function (baz, five) {
			expect(arguments.length).to.equal(2)
			expect(baz).to.equal('baz')
			expect(five).to.equal(5)
		})
		foo.emit('bar', 'baz', 5)
	})
	it('should emit three args', function () {
		var foo = new JellyEmitter
		foo.on('bar', function (baz, five, nil) {
			expect(arguments.length).to.equal(3)
			expect(baz).to.equal('baz')
			expect(five).to.equal(5)
			expect(nil).to.equal(null)
		})
		foo.emit('bar', 'baz', 5, null)
	})
	it('should emit five args', function () {
		var foo = new JellyEmitter
		foo.on('bar', function (baz, five, nil, f, t) {
			expect(arguments.length).to.equal(5)
			expect(baz).to.equal('baz')
			expect(five).to.equal(5)
			expect(nil).to.equal(null)
			expect(f).to.be.false
			expect(t).to.be.true
		})
		foo.emit('bar', 'baz', 5, null, false, true)
	})
	it('should emit 100 args', function () {
		var foo = new JellyEmitter
		foo.on('bar', function () {
			expect(arguments.length).to.equal(100)
			expect(arguments[99]).to.equal('baz')
		})
		var arr = new Array(101)
		arr[0] = 'bar'
		arr[100] = 'baz'
		foo.emit.apply(foo, arr)
	})
	it('should treat no arg emits normally', function () {
		var foo = new JellyEmitter
		var emitted = false
		foo.on(undefined, function () {
			emitted = true
		})
		foo.emit()
		expect(emitted).to.be.true
	})
	it('should treat undefined events normally', function () {
		var foo = new JellyEmitter
		var emitted = false
		foo.on(undefined, function (a, b) {
			emitted = true
			expect(a).to.equal('bar')
			expect(b).to.equal('baz')
		})
		foo.emit(undefined, 'bar', 'baz')
		expect(emitted).to.be.true
	})
	it('should treat all values as object keys', function () {
		var foo = new JellyEmitter
		var emitted = 0
		var emittedBad = 0
		foo.on('NaN', function (a) {
			emitted++
			expect(a).to.equal('bar')
		})
		foo.emit(NaN, 'bar')
		foo.on('-Infinity', function (a) {
			emitted++
			expect(a).to.equal('baz')
		})
		foo.emit(-Infinity, 'baz')
		foo.on(null, function (a) {
			emitted++
			expect(a).to.equal('bax')
		})
		foo.emit('null', 'bax')
		foo.on('[object Object]', function (a) {
			emitted++
			expect(a).to.equal('baq')
		})
		foo.emit({}, 'baq')
		if (typeof Symbol === 'function') {
			var supportsSymbols = true
			var sym = Symbol('sym')
			foo.on(sym, function (a) {
				emitted++
				expect(a).to.equal('quax')
			})
			foo.emit(sym, 'quax')
			
			var sym2 = Symbol()
			foo.on(sym2, function (a) {
				emittedBad++
			})
			foo.emit(String(sym2), 'quax')
			
			var foo2 = new JellyEmitter
			foo2.on(String(sym2), function (a) {
				emittedBad++
			})
			foo2.emit(sym2, 'quax')
		}
		expect(emitted).to.equal(4 + supportsSymbols)
		expect(emittedBad).to.equal(0)
	})
})
