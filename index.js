// todo:原型
function spacify(str) {
    return str.split('').join(' ')
}

console.log(spacify('hello world'))

// todo:call bind apply
function log() {
    console.log.apply(console, arguments);
}

log('hello');

// todo:this指向
var user = {
    count: 1,
    getCount: function () {
        return this.count
    }
}
console.log(user.getCount());

var func = user.getCount;
console.log(func());

// todo:构造函数 
// ? 对象的原型是不是prototype ?


function Person() {

}

var person1 = new Person();
person1.name = 'LLF';
console.log(person1.name, person1.prototype); // LLF
// ! 这里需要讲一个很绕的点: 实例的隐式原型是构造函数的原型,构造函数的原型的原型又是Object的原型,Object的原型的原型又是null
console.log(person1.__proto__ === Person.prototype, 222222222) // true
console.log(Person.prototype.__proto__ === Object.prototype, 222222222) // true
console.log(Object.prototype.__proto__ === null, 222222222) // true

var person2 = new Person();
person2.name = 'ZXX';
console.log(person2.name, person2.prototype); // ZXX


// todo: constructor
function Person() {

}

var person1 = new Person();

console.log(Person === Person.prototype.constructor);

// todo: 实例与原型
function Person() {

}

Person.prototype.name = 'LLF';
var person1 = new Person();
person1.name = 'ZXX';
delete person1.name;
console.log(person1.name) // LLF


// todo:原型对象

var obj = new Object();
obj.name = 'LLF'
console.log(obj.name) // LLF

console.log(obj.__proto__ === Object.prototype) // true
console.log(Object.prototype.__proto__ === null) // true



// todo:继承

class SuperType {
    constructor(name) {
        this.name = name;
    }

    sayName() {
        console.log(this.name)
        return this.name
    }
}

class SubType extends SuperType {
    constructor(name, age) {
        super(name)
        this.age = age;
    }
    sayAge() {
        console.log(this.age);
        return this.age
    }
}

const sub = new SubType('tom', 18);
console.log(sub.sayAge(), sub.sayName(), 22, 1)

// todo:闭包


function SayHi(name) {
    return () => {
        console.log(`hi~~${name}`)
    }
}

const funcLLF = SayHi('LLF');
console.log(funcLLF()); // hi~~LLF


// todo:利用闭包实现私有属性

const text = (function () {
    let value = 0;
    return {
        getVal() { return value },
        setVal(val) { value = val },
    }
}())


text.setVal(111);
console.log(text.getVal()) // 111


// todo:没有使用闭包

let a = 10

// 假设中间其他开发者又对它赋值了 , 结果就是我们理想的
a = 100;


function count() {
    a++;
    console.log(a)
}

count();
count();
count();

// todo: 使用闭包

var b = 10

function count() {
    b++;
    return () => {
        console.log(b);
    }
}

console.log(count()()) // 11
console.log(count()()) // 12
console.log(count()()) // 13

// todo: 闭包类型考题
//1.有一个函数，参数是一个函数，返回值也是一个函数，返回的函数功能和入参的函数相似，但这个函数只能执行3次，再次执行无效，如何实现

const bibaoFunc = (fn) => {
    let times = 0;
    return () => {
        if (times++ < 3) {
            fn()
        }
    }
}

function fn() {
    console.log('大师 你好')
}
const testFunc = bibaoFunc(fn);
console.log(testFunc(), 11);// 大师 你好
console.log(testFunc(), 22);// 大师 你好
console.log(testFunc(), 33);// 大师 你好
console.log(testFunc(), 44);// undefined
console.log(testFunc(), 55);// undefined


//2.实现add函数,让add(a)(b)和add(a,b)两种调用结果相同


function add(a, b) {
    if (b === undefined) {
        return (x) => {
            return a + x;
        }
    }
    return a + b
}

console.log(add(1)(2) === add(1, 2))   // true