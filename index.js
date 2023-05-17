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

// 普通函数实现
function add(a, b) {
    if (b === undefined) {
        return (x) => {
            return a + x;
        }
    }
    return a + b
}

console.log(add(1)(2) === add(1, 2))   // true

// todo:柯里化实现
function addFunc(num1, num2) {
    return num1 + num2;
}

function curry(fn, num1) {
    return function (num2) {
        return fn(num1, num2)
    }
}

const curriedAdd = curry(addFunc, 1);

console.log(curriedAdd(2))


// todo: 多个参数的实现 抽象一下 

function curry(fn) {
    const curryArgs = Array.form(arguments).slice(1); // 排除第一个fn参数
    return () => {
        const funcArgs = Array.from(arguments); // 获取回调函数的参数 也就是num2
        return fn(...curryArgs, ...funcArgs);
    }
}

// 继续优化代码

function curry(fn, ...curryArgs) {
    return (...funcArgs) => {
        return fn(...curryArgs, ...funcArgs);
    }
}


// todo:柯里化好处 
// 举例  

let list = [
    {
        name:'lucy'
    },
    {
        name:'jack'
    }
]

// 取list里的所有name  
// 常规思路
let names = list.map(function(item) {
    return item.name;
  })


let prop  = curry(function(key,obj){
    console.log(obj,22222)
    return obj[key];
})

let  CurryNames = list.map(prop('name'))

// 柯里化函数封装

function curry(fn, len = fn.length) {
    return _curry.call(this, fn, len)
}

function _curry(fn, len, ...args) {
    return function (...params) {
        let _args = [...args, ...params];
        if (_args.length >= len) {
            return fn.apply(this, _args)
        } else {
            return _curry.call(this, fn, len, ..._args);
        }
    }
}
let _fn = curry(function (a, b, c, d, e) {
    console.log(a, b, c, d, e)
});

console.log(_fn(1)(2)(3, 4, 5), 222) // print: 1,2,3,4,5


// todo bind封装

Function.prototype.myBind = function(context,...args){
    const self = this;
    return function(){
        return self.call(context,args)
    }
}

var obj1 ={
    name:'LLF'
}

var name  = 'ZXX'

function bindTest(){
    return function(){
        return this.name;
    }
}
// let bindName  =  bindTest();
// console.log(bindName()) // ZXX

let bindName  =  bindTest().myBind(obj1);
console.log(bindName()) // LLF



// todo 深拷贝

let obj1 = {a:1};

let obj2 = obj1;

obj2.a = 4;

console.log(obj1.a); // 4




// todo: 应用场景 更新数组child

const arr = [
    {
      "children": [
        {
          "pkId": "__-dHypQyE5nPIp7bhZsnSpAw-__",
          "strategyLineId": null,
          "tenantId": 30,
          "nodeConfigId": 12981,
          "nodeConfigIndexAbc": "A",
          "nodeConfigIndex": 0,
          "nodeConfigCode": "10",
          "nodeConfigName": "接收并入库",
          "actionCode": "WAITING",
          "actionName": "待执行",
          "actionMeaning": null,
          "authorityCode": "QUERY,UPDATE,",
          "actionCount": null,
          "reverseEnable": 1
        },
        {
          "pkId": "__-HDjZEBicyaxTTw7nAmBqvg-__",
          "strategyLineId": null,
          "tenantId": 30,
          "nodeConfigId": 12981,
          "nodeConfigIndexAbc": "A",
          "nodeConfigIndex": 0,
          "nodeConfigCode": "10",
          "nodeConfigName": "接收并入库",
          "actionCode": "DOING",
          "actionName": "执行中",
          "actionMeaning": null,
          "authorityCode": "QUERY,UPDATE,",
          "actionCount": null,
          "reverseEnable": 1
        },
        {
          "pkId": "__-ejKZfuGYF-mGB3NjX94cPQ-__",
          "strategyLineId": null,
          "tenantId": 30,
          "nodeConfigId": 12981,
          "nodeConfigIndexAbc": "A",
          "nodeConfigIndex": 0,
          "nodeConfigCode": "10",
          "nodeConfigName": "接收并入库",
          "actionCode": "FINISHED",
          "actionName": "已完成",
          "actionMeaning": null,
          "authorityCode": "QUERY,UPDATE,",
          "actionCount": null,
          "reverseEnable": 1
        }
      ],
    },
    {
      "children": [
        {
          "pkId": "__-0vckJjtO1v2Iqeb6-WcR2g-__",
          "strategyLineId": null,
          "tenantId": 30,
          "nodeConfigId": 12982,
          "nodeConfigIndexAbc": "C",
          "nodeConfigIndex": 1,
          "nodeConfigCode": "20",
          "nodeConfigName": "接收",
          "actionCode": "WAITING",
          "actionName": "待执行",
          "actionMeaning": null,
          "authorityCode": "QUERY,UPDATE,",
          "actionCount": null,
          "reverseEnable": 1
        },
        {
          "pkId": "__-sE5b9crW1gl7kwKXcf7nxA-__",
          "strategyLineId": null,
          "tenantId": 30,
          "nodeConfigId": 12982,
          "nodeConfigIndexAbc": "C",
          "nodeConfigIndex": 1,
          "nodeConfigCode": "20",
          "nodeConfigName": "接收",
          "actionCode": "DOING",
          "actionName": "执行中",
          "actionMeaning": null,
          "authorityCode": "QUERY,UPDATE,",
          "actionCount": null,
          "reverseEnable": 1
        },
        {
          "pkId": "__-TOJ3Mi1964gl0xWu8H41qA-__",
          "strategyLineId": null,
          "tenantId": 30,
          "nodeConfigId": 12982,
          "nodeConfigIndexAbc": "C",
          "nodeConfigIndex": 1,
          "nodeConfigCode": "20",
          "nodeConfigName": "接收",
          "actionCode": "FINISHED",
          "actionName": "已完成",
          "actionMeaning": null,
          "authorityCode": "QUERY,UPDATE,",
          "actionCount": null,
          "reverseEnable": 1
        }
      ],
  
    },
  ]
  
  
  
  
  const waitArr = [
    {
      "children": [
        {
          "pkId": "__-dHypQyE5nPIp7bhZsnSpAw-__",
          "strategyLineId": null,
          "tenantId": 30,
          "nodeConfigId": 12981,
          "nodeConfigIndexAbc": "A",
          "nodeConfigIndex": 0,
          "nodeConfigCode": "10",
          "nodeConfigName": "接收并入库",
          "actionCode": "WAITING",
          "actionName": "待执行",
          "actionMeaning": null,
          "authorityCode": "QUERY,UPDATE,",
          "actionCount": 10636,
          "reverseEnable": 1
        },
        {
          "pkId": "__-HDjZEBicyaxTTw7nAmBqvg-__",
          "strategyLineId": null,
          "tenantId": 30,
          "nodeConfigId": 12981,
          "nodeConfigIndexAbc": "A",
          "nodeConfigIndex": 0,
          "nodeConfigCode": "10",
          "nodeConfigName": "接收并入库",
          "actionCode": "DOING",
          "actionName": "执行中",
          "actionMeaning": null,
          "authorityCode": "QUERY,UPDATE,",
          "actionCount": null,
          "reverseEnable": 1
        },
        {
          "pkId": "__-ejKZfuGYF-mGB3NjX94cPQ-__",
          "strategyLineId": null,
          "tenantId": 30,
          "nodeConfigId": 12981,
          "nodeConfigIndexAbc": "A",
          "nodeConfigIndex": 0,
          "nodeConfigCode": "10",
          "nodeConfigName": "接收并入库",
          "actionCode": "FINISHED",
          "actionName": "已完成",
          "actionMeaning": null,
          "authorityCode": "QUERY,UPDATE,",
          "actionCount": null,
          "reverseEnable": 1
        }
      ],
    },
    {
      "children": [
        {
          "pkId": "__-0vckJjtO1v2Iqeb6-WcR2g-__",
          "strategyLineId": null,
          "tenantId": 30,
          "nodeConfigId": 12982,
          "nodeConfigIndexAbc": "C",
          "nodeConfigIndex": 1,
          "nodeConfigCode": "20",
          "nodeConfigName": "接收",
          "actionCode": "WAITING",
          "actionName": "待执行",
          "actionMeaning": null,
          "authorityCode": "QUERY,UPDATE,",
          "actionCount": 2999,
          "reverseEnable": 1
        },
        {
          "pkId": "__-sE5b9crW1gl7kwKXcf7nxA-__",
          "strategyLineId": null,
          "tenantId": 30,
          "nodeConfigId": 12982,
          "nodeConfigIndexAbc": "C",
          "nodeConfigIndex": 1,
          "nodeConfigCode": "20",
          "nodeConfigName": "接收",
          "actionCode": "DOING",
          "actionName": "执行中",
          "actionMeaning": null,
          "authorityCode": "QUERY,UPDATE,",
          "actionCount": null,
          "reverseEnable": 1
        },
        {
          "pkId": "__-TOJ3Mi1964gl0xWu8H41qA-__",
          "strategyLineId": null,
          "tenantId": 30,
          "nodeConfigId": 12982,
          "nodeConfigIndexAbc": "C",
          "nodeConfigIndex": 1,
          "nodeConfigCode": "20",
          "nodeConfigName": "接收",
          "actionCode": "FINISHED",
          "actionName": "已完成",
          "actionMeaning": null,
          "authorityCode": "QUERY,UPDATE,",
          "actionCount": null,
          "reverseEnable": 1
        }
      ],
  
    },
  ]
  
  
  
  const doingArr = [
    {
      "children": [
        {
          "pkId": "__-dHypQyE5nPIp7bhZsnSpAw-__",
          "strategyLineId": null,
          "tenantId": 30,
          "nodeConfigId": 12981,
          "nodeConfigIndexAbc": "A",
          "nodeConfigIndex": 0,
          "nodeConfigCode": "10",
          "nodeConfigName": "接收并入库",
          "actionCode": "WAITING",
          "actionName": "待执行",
          "actionMeaning": null,
          "authorityCode": "QUERY,UPDATE,",
          "actionCount": null,
          "reverseEnable": 1
        },
        {
          "pkId": "__-HDjZEBicyaxTTw7nAmBqvg-__",
          "strategyLineId": null,
          "tenantId": 30,
          "nodeConfigId": 12981,
          "nodeConfigIndexAbc": "A",
          "nodeConfigIndex": 0,
          "nodeConfigCode": "10",
          "nodeConfigName": "接收并入库",
          "actionCode": "DOING",
          "actionName": "执行中",
          "actionMeaning": null,
          "authorityCode": "QUERY,UPDATE,",
          "actionCount": 9999,
          "reverseEnable": 1
        },
        {
          "pkId": "__-ejKZfuGYF-mGB3NjX94cPQ-__",
          "strategyLineId": null,
          "tenantId": 30,
          "nodeConfigId": 12981,
          "nodeConfigIndexAbc": "A",
          "nodeConfigIndex": 0,
          "nodeConfigCode": "10",
          "nodeConfigName": "接收并入库",
          "actionCode": "FINISHED",
          "actionName": "已完成",
          "actionMeaning": null,
          "authorityCode": "QUERY,UPDATE,",
          "actionCount": null,
          "reverseEnable": 1
        }
      ],
    },
    {
      "children": [
        {
          "pkId": "__-0vckJjtO1v2Iqeb6-WcR2g-__",
          "strategyLineId": null,
          "tenantId": 30,
          "nodeConfigId": 12982,
          "nodeConfigIndexAbc": "C",
          "nodeConfigIndex": 1,
          "nodeConfigCode": "20",
          "nodeConfigName": "接收",
          "actionCode": "WAITING",
          "actionName": "待执行",
          "actionMeaning": null,
          "authorityCode": "QUERY,UPDATE,",
          "actionCount": null,
          "reverseEnable": 1
        },
        {
          "pkId": "__-sE5b9crW1gl7kwKXcf7nxA-__",
          "strategyLineId": null,
          "tenantId": 30,
          "nodeConfigId": 12982,
          "nodeConfigIndexAbc": "C",
          "nodeConfigIndex": 1,
          "nodeConfigCode": "20",
          "nodeConfigName": "接收",
          "actionCode": "DOING",
          "actionName": "执行中",
          "actionMeaning": null,
          "authorityCode": "QUERY,UPDATE,",
          "actionCount": 88888,
          "reverseEnable": 1
        },
        {
          "pkId": "__-TOJ3Mi1964gl0xWu8H41qA-__",
          "strategyLineId": null,
          "tenantId": 30,
          "nodeConfigId": 12982,
          "nodeConfigIndexAbc": "C",
          "nodeConfigIndex": 1,
          "nodeConfigCode": "20",
          "nodeConfigName": "接收",
          "actionCode": "FINISHED",
          "actionName": "已完成",
          "actionMeaning": null,
          "authorityCode": "QUERY,UPDATE,",
          "actionCount": null,
          "reverseEnable": 1
        }
      ],
  
    },
  ]
  const BL = (arr) => {
    return arr.map(i => {
      if (i.children) {
        const children = i.children.map(item => {
          return {
            ...item,
            title: `${item.actionName}(${item.actionCount})`,
  
          }
        })
        return {
          ...i,
          parentId: null,
          pkId: i.nodeConfigId,
          children,
        }
      }
    })
  }
  
  console.log(BL(arr))
  console.log(BL(waitArr))
  console.log(BL(doingArr))
  
  
  
  //  需要的结果  数组2的每个节点的children 待执行 替换数组1的children
  
  function deepClone(obj, hash = new WeakMap()) {
    if (obj === null) return obj; // 如果是null或者undefined我就不进行拷贝操作
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof RegExp) return new RegExp(obj);
    // 可能是对象或者普通的值  如果是函数的话是不需要深拷贝
    if (typeof obj !== "object") return obj;
    // 是对象的话就要进行深拷贝
    if (hash.get(obj)) return hash.get(obj);
    let cloneObj = new obj.constructor();
    // 找到的是所属类原型上的constructor,而原型上的 constructor指向的是当前类本身
    hash.set(obj, cloneObj);
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 实现一个递归拷贝
        cloneObj[key] = deepClone(obj[key], hash);
      }
    }
    return cloneObj;
  }
  
  
  const changeArr = (A, B) => {
    A.forEach(x => {
  
      B.forEach(y => {
        x.children[1] = deepClone(y.children[1])
      })
    })
    return A
  }
  
  console.log(changeArr(BL(arr), BL(doingArr))
  )