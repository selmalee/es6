function MyPromise(fn) {
  this.status = 'pending'
  this.result = null
  this.stack = []
  // this.fufillQueue = []
  // this.rejectQueue = []
  fn(this.resolve.bind(this), this.reject.bind(this))
  // 私有方法
  // 返回一个状态由给定value决定的Promise对象。如果该值是thenable(即，带有then方法的对象)，返回的Promise对象的最终状态由then方法执行决定；否则的话(该value为空，基本类型或者不带then方法的对象),返回的Promise对象状态为fulfilled，并且将该value传递给对应的then方法。通常而言，如果你不知道一个值是否是Promise对象，使用Promise.resolve(value) 来返回一个Promise对象,这样就能将该value以Promise对象形式使用。
  this.resolve = (result) => {
    this.result = result
    this.status = 'fufilled'
  }
  // 返回一个状态为失败的Promise对象，并将给定的失败信息传递给对应的处理方法
  this.reject = (error) => {
    this.result = error
    this.status = 'rejected'
  }
}
// 原型方法
// 添加解决(fulfillment)和拒绝(rejection)回调到当前 promise, 返回一个新的 promise, 将以回调的返回值来resolve.
MyPromise.prototype.then = (onFulfilled, onRejected) => {
  const { status, stack, value } = this
  const promise = new MyPromise()
  if (status === 'pending') {
    stack.push({onFulfilled, onRejected, promise})
  } else if (status === 'fufilled') {
    onFulfilled(value)
  } else {
    onRejected(value)
  }
  return promise
}
// 添加一个拒绝(rejection) 回调到当前 promise, 返回一个新的promise。当这个回调函数被调用，新 promise 将以它的返回值来resolve，否则如果当前promise 进入fulfilled状态，则以当前promise的完成结果作为新promise的完成结果.
MyPromise.prototype.catch = (onRejected) => { 
  return promise
}


const p = new MyPromise((resolve) => {resolve(1)})
console.log(p)
console.log(p.then(() => {console.log(222)}))
