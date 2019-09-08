// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind

Function.prototype.myBind = function(thisArg, ...argArray) {
  var BoundTargetFunction = this
  function bindFn() {
    return BoundTargetFunction.call(thisArg, ...argArray)
  }
  return bindFn
}

this.x = 9;    // 在浏览器中，this指向全局的 "window" 对象；在nodejs中，this指向一个空对象
var module = {
  x: 81,
  getX: function(a, b) {
    console.log(`a: ${a} b: ${b}`)
    return this.x
  }
};

var retrieveX = module.getX;
console.log(retrieveX())
// 浏览器中返回9 - 因为函数是在全局作用域中调用的
// nodejs中返回undefined - 在普通函数中this指向的是global对象

// 创建一个新函数，把 'this' 绑定到 module 对象
// 新手可能会将全局变量 x 与 module 的属性 x 混淆
var boundGetX = retrieveX.myBind(module, 1, 2);
console.log(boundGetX()) // 81
