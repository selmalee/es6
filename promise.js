// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise

var { isFunction } = require('./utils/index')

var PENDING = 0
var FULFILLED = 1
var REJECTED = 2

function doResolve(thisArg, value) {
  thisArg.status = FULFILLED
  thisArg.value = value
  thisArg.queue.forEach(item => {
    item.callFulfilled && item.callFulfilled(value)
  })
}

function doReject(thisArg, value) {
  thisArg.status = REJECTED
  thisArg.value = value
  thisArg.queue.forEach(item => {
    item.callRejected && item.callRejected(value)
  })
}

function QueueItem(promise, onFulfilled, onRejected) {
  this.promise = promise
  if (onFulfilled) {
    this.callFulfilled = function(value) {
      onFulfilled(value)
      doResolve(promise, value)
    }
  }
  if (onRejected) {
    this.callRejected = function(value) {
      onRejected(value)
      doResolve(promise, value)
    }
  }
}

/**
 * MyPromise
 * @param {*} executor executor是带有 resolve 和 reject 两个参数的函数 。
 */
function MyPromise(executor) {
  if (!isFunction(executor)) {
    throw new TypeError('resolver must be a function')
  }
  this.status = PENDING
  this.value = undefined
  this.queue = []
  // resolve 和 reject 函数被调用时，分别将promise的状态改为fulfilled（完成）或rejected（失败）。
  this.resolve = function(value) {
    doResolve(this, value)
  }
  this.reject = function(value) {
    doReject(this, value)
  }
  // Promise构造函数执行时立即调用executor 函数， resolve 和 reject 两个函数作为参数传递给executor（executor 函数在Promise构造函数返回所建promise实例对象前被调用）。
  try {
    executor(this.resolve.bind(this), this.reject.bind(this))
  } catch(e) {
    // 如果在executor函数中抛出一个错误，那么该promise 状态为rejected。
    this.reject(e).bind(this)
  }
}

// 添加解决(fulfillment)和拒绝(rejection)回调到当前 promise, 返回一个新的 promise, 将以回调的返回值来resolve.
MyPromise.prototype.then = function(onFulfilled, onRejected) {
  if (!isFunction(onFulfilled) && this.state === FULFILLED ||
    !isFunction(onRejected) && this.state === REJECTED) {
    return this;
  }
  var promise = new MyPromise(function(){})
  var queueItem = new QueueItem(promise, onFulfilled, onRejected)
  this.queue.push(queueItem)
  // 可能在then之前已经resolve了
  if (this.status === FULFILLED) {
    queueItem.callFulfilled(this.value)
  }
  return promise
}
// 添加一个拒绝(rejection) 回调到当前 promise, 返回一个新的promise。当这个回调函数被调用，新 promise 将以它的返回值来resolve，否则如果当前promise 进入fulfilled状态，则以当前promise的完成结果作为新promise的完成结果.
MyPromise.prototype.catch = function(onRejected) {
  var promise = new MyPromise(function(){})
  this.queue.push(new QueueItem(promise, undefined, onRejected))
  // 可能在catch之前已经reject了
  if (this.status === REJECTED) {
    queueItem.callRejected(this.value)
  }
  return promise
}

/**
 * Promise.all
 * @param {*} promises
 * @returns
 */
MyPromise.all = function (promises) {
  if (!Array.isArray(promises)) {
    throw new TypeError('arguments is not an array')
  }
  var promise = new MyPromise(function(resolve, reject){
    var resArr = []
    var len = promises.length
    for (let i = 0; i < len; i++) {
      if (!(promises[i] instanceof MyPromise)) {
        throw new TypeError('It is not an MyPromise instance')
      }
      promises[i].then(function(res) {
        resArr.push(res)
        if (resArr.length === len) {
          resolve(resArr)
        }
      }, function(err) {
        reject(err)
      })
    }
  })
  return promise
}


// var promise = new MyPromise((resolve) => {
//   setTimeout(() => {
//     console.log('resolve')
//     resolve('haha')
//   }, 1000)
// })
// 当最外层的 promise 状态改变时，遍历它的 queue 数组调用对应的回调，设置子 promise 的 status 和 value 并遍历它的 queue 数组调用对应的回调，然后设置孙 promise 的 status 和 value 并遍历它的 queue 数组调用对应的回调......依次类推
// promise
//   .then((res) => {
//     console.log(res)
//     // console.dir(promise, { depth: 10 })
//     return res
//   })
//   .then(() => {
//     console.log('then2')
//   })
  // .then(() => {
  //   console.log('then3')
  //   // console.dir(promise, { depth: 10 })
  // })
// console.dir(promise, { depth: 10 })
// MyPromise.all(
//   [new MyPromise(function(resolve){
//     setTimeout(() => {
//       console.log('resolve1')
//       resolve('resolve1')
//     }, 1000)
//   }),
//   new MyPromise(function(resolve){
//     setTimeout(() => {
//       console.log('resolve2')
//       resolve('resolve2')
//     }, 1000)
//   })]
// )
// .then(function (res) {
//   console.log(res)
// })
// .catch(function (err) {
//   console.error(err)
// })

new MyPromise(function(resolve, reject){resolve(1)}).then(function(res){console.log('then')})