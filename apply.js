Function.prototype.myApply = function(thisArg, argArray) {
  if (thisArg) {
    thisArg.fn = this // 把要调用的函数挂载在thisArg对象上
    const result = thisArg.fn(argArray)
    delete thisArg.fn
    return result
  } else {
    return this(...argArray)
  }
}

var numbers = [5, 6, 2, 3, 7];

var max = Math.max.myApply(null, numbers);

console.log(max);
// expected output: 7

var min = Math.min.myApply(null, numbers);

console.log(min);
// expected output: 2
