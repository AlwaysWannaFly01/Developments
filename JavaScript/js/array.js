/*一、 检测方法*/
Array.isArray([1, 2, 3]) // true
Array.isArray({ foo: 123 }) //false
Array.isArray('foobar') //false
Array.isArray(undefined) //false

/*---------------------------------------------------*/

/*二、 创建数组方法*/
// 报错
// Array.from(undefined)
// 报错
// Array.from(null)
// ["f", "o", "o"]
console.log(Array.from('foo'))
// []
console.log(Array.from(''))
// []
console.log(Array.from(123))
// []
console.log(Array.from(NaN))

// arguments对象转为数组
function foo() {
    const args = Array.from(arguments)
    //   console.log(args); // [1, 2, 3]
    //true
    console.log(Array.isArray(args))
}
foo(1, 2, 3)

// NodeList对象转为数组
Array.from(document.querySelectorAll('p'))

// Set对象转为数组：['a','b']
Array.from(new Set(['a', 'b']))

// Map对象转为数组：[[1, 2], [2, 4]]
Array.from(
    new Map([
        [1, 2],
        [2, 4],
    ])
)

// 传入第二个参数回调函数
let a = Array.from([1, 2, 3], (x) => x + x)
console.log(a) //[2, 4, 6]

let obj = {
    num: 1,
    handle: function (value) {
        return value + this.num
    },
}
// 传入第三个参数修改this指向
const arrs = Array.from([1, 2, 3, 4, 5], obj.handle, obj)
console.log(arrs) //[2, 3, 4, 5, 6]

// 得到数组对象里的id属性：[1, 2]
const obj2 = [
    { id: 1, name: 'zhangsan' },
    { id: 2, name: 'lisi' },
]
let arr2 = Array.from(obj2, (el) => {
    return el.id
})

console.log(arr2) //[1, 2]

/*---------------------------------------------------*/

Array.of() // []
Array.of(undefined) // [undefined]
Array.of(null) // [null]
Array.of(NaN) // [NaN]
Array.of(1, 2) // [1, 2]
Array.of([1, 2, 3]) // [[1,2,3]]
Array.of({ id: 1 }, { id: 2 }) // [{id:1}, {id:2}]

/*三、 遍历（迭代）方法*/

/*---------------------------------------------------*/

// 1.forEach()

const arr3 = [
    { id: 1, name: 'zhangsan' },
    { id: 2, name: 'lisi' },
]
// 1 - zhangsan
// 2 - lisi
arr3.forEach((el) => {
    console.log(`${el.id} - ${el.name}`)
})

arr3.forEach(function (el, index, arr) {
    if (el.id === 1) {
        return
    }
    console.log(this === obj) // true
    console.log(arr)
}, obj)


//2.map()
const arr = [{id: 1},{id: 2},{id: 3}]
const newArr = arr.map((el,index,arr) => {
    el.age = 20
    return el
});
//[{id: 1,age: 20},{id: 2,age: 20},{id: 3,age: 20}]
console.log(newArr);


//3.filter()
const arr4 = [{id: 1},{id: 2},{id: 3}]
const newArr2 = arr4.filter((el,index,arr) => {
    el.age = 20
    return el
});
// [{id: 1,age: 20},{id: 2,age: 20},{id: 3,age: 20}]
console.log(newArr2);

//4.some()
const arr5 = [{id: 1},{id: 2},{id: 3}]
const someResult = arr5.some((el,index,arr) => {
    return el.id === 1
});
// true
console.log(someResult)


