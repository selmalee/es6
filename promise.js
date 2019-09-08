var { isFunction } = require('./utils/index')

var PENDING = 0
var FULFILLED = 1
var REJECTED = 2

function doResolve(thisArg, value) {
  thisArg.status = FULFILLED
  thisArg.value = value
  thisArg.queue.forEach(item => {
    item.callFulfilled(value)
  })
}

function doReject(thisArg, value) {
  thisArg.status = REJECTED
  thisArg.value = value
  thisArg.queue.forEach(item => {
    item.callRejected(value)
  })
}

function QueueItem(promise, onFulfilled, onRejected) {
  this.promise = promise
  this.callFulfilled = function(value) {
    onFulfilled(value)
    doResolve(promise, value)
  }
  this.callRejected = function(value) {
    onRejected(value)
    doResolve(promise, value)
  }
}

function MyPromise(executor) {
  if (!isFunction(executor)) {
    throw new TypeError('resolver must be a function')
  }
  this.status = PENDING
  this.value = undefined
  this.queue = []

  this.resolve = function(value) {
    doResolve(this, value)
  }
  this.reject = function(value) {
    doReject(this, value)
  }
  executor(this.resolve.bind(this), this.reject.bind(this))
}

MyPromise.prototype.then = function(onFulfilled, onRejected) {
  if (!isFunction(onFulfilled) && this.state === FULFILLED ||
    !isFunction(onRejected) && this.state === REJECTED) {
    return this;
  }
  var promise = new MyPromise(function(){})
  this.queue.push(new QueueItem(promise, onFulfilled, onRejected))
  return promise
}

MyPromise.prototype.catch = function(onRejected) {
  var promise = new MyPromise(function(){})
  this.queue.push(new QueueItem(promise, undefined, onRejected))
  return promise
}


var promise = new MyPromise((resolve) => {
  setTimeout(() => {
    console.log('resolve')
    resolve('haha')
  }, 1000)
})
// 当最外层的 promise 状态改变时，遍历它的 queue 数组调用对应的回调，设置子 promise 的 status 和 value 并遍历它的 queue 数组调用对应的回调，然后设置孙 promise 的 status 和 value 并遍历它的 queue 数组调用对应的回调......依次类推
promise
  .then((res) => {
    console.log(res)
    // console.dir(promise, { depth: 10 })
    return res
  })
  .then(() => {
    console.log('then2')
  })
  .then(() => {
    console.log('then3')
    // console.dir(promise, { depth: 10 })
  })
// console.dir(promise, { depth: 10 })