// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call

Function.prototype.myCall = function(thisArg, ...argArray) {
  if (thisArg) {
    thisArg.fn = this // 把要调用的函数挂载在thisArg对象上
    const result = thisArg.fn(...argArray)
    delete thisArg.fn
    return result
  } else {
    return this(...argArray)
  }
  // es5写法 没有数组解构的方法
  // var args = [];
  // for (var i = 1, len = arguments.length; i < len; i++) {
  //   args.push('arguments[' + i + ']');
  // }
  // // ['arguments[1]','arguments[2]']
  // var star = 'thisArg.fn(' + args + ')'
  // // thisArg.fn(arguments[1],arguments[2])
  // eval('thisArg.fn(' + args + ')');
}

function Product(name, price) {
  this.name = name;
  this.price = price;
}

function Food(name, price) {
  Product.myCall(this, name, price);
  this.category = 'food';
}

console.log(new Food('cheese', 5).name);
