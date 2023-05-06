# 1.Object.protoType(对象原型)

> 考察 spacify('hello world') // => 'h e l l o w o r l d'

#### 转化

            function spacify(str) {
                return str.split('').join(' ')
            }

> ('hello world').spacify 能放在对象上面 类似这样

#### 考察原型

            String.prototype.spacify =()=>{
                return str.split('').join(' ')
            }

#### 接着考察函数声明合函数表达式的区别

|                      函数声明                      |                               函数表达式                                |
| :------------------------------------------------: | :---------------------------------------------------------------------: |
|    函数声明创建的函数都是已定义的，这被称为提升    |                 函数表达式创建的函数要等执行完才被定义                  |
| 函数将在执行代码前创建，即使未调用，也占用内存空间 | 函数将在运行阶段执行代码时临时创建,调用完，立即释放，所以更节省内存空间 |

# 2.参数 arguments

> log('hello world')定义 log 方法

            function log (){
                console.log.apply(console,arguments); // hello
            }

            log('hello');

#### 接着考察 call, apply, bind 区分

>

1. call，apply，bind 都是可以改变函数体内 this 的指向。
2. call，apply，bind 使用时，传入的第一个参数都是用来传递 this 的指向的，也就是对上下文的指定
3. call，apply，bind 都是可以传入多个参数，不同的是，call 和 bind 的后续参数都是按照顺序传参，而 apply 的传参类型是数组；bind 的参数可以在函数执行的时候再次添加。

# 3.上下文

> 考察上下文 this 的理解

                var user = {
                    count:1,
                    getCount:function(){
                        return this.count
                    }
                }
                console.log(user.getCount()); // 1
                var func = user.getCount;
                console.log(func()); // undefined

> 接着考察 怎么保证 user 总能访问到上下文的 this

                var func = user.getCount.bind(user);
                console.log(func()); // undefined

> 又考察如何实现一个 bind

                Function.prototype.bind = Function.prototype.bind || function(context){
                    var self = this;
                    return function(){
                        return self.apply(context,arguments);
                    }
                }

# 4. 弹出窗口（Overlay library）

> 写一个弹出窗口的库

            .overlay {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            background: rgba(0,0,0,.8);
            }

> 这边有两部分可以考察 absolute 和 fixe 区别

|                        absolute                        |                  fixed                   |                         static                         |                               relative                               |
| :----------------------------------------------------: | :--------------------------------------: | :----------------------------------------------------: | :------------------------------------------------------------------: |
|                        固定定位                        |                 绝对定位                 |                        静态定位                        |                               相对定位                               |
| 有滚动条后 absolute 会随参照对象元素的宽高变化为移动。 | 有滚动条后，fixed 始终会在定好的位置不动 | 是 HTML 中的默认定位，符合常规文档流，这里没太多内容。 | 对象相对于本身位置而言，进行上下左右的偏移，但注意，它不脱离文档流！ |

# 5.原型和原型链

> 这块要有很多要讲, 从构造函数创建对象,prototype,_proto_,constructor,实例与原型,原型的原型,原型链, 直接进入正题

#### 1.构造函数创建对象

> Person 是一个构造函数, 通过 new 创建了一个实例对象 person

                function Person(){

                }

                var person = new Person();
                person.name = 'LLF';
                console.log(person.name); // LLF

#### 2. prototype

// **_错误理解_**

**每个函数都有一个 Prototype 属性, 同时 Object 也有**

![这是图片](/images/1.png)

// **_更正_**
**只有函数对象才有 prototype 属性, 普通的实例对象是没有的**

                function Person(){

                }

                var person1= new Person();
                person1.name = 'LLF';
                console.log(person1.name,person1.prototype); // LLF undefined
                 var person2 = new Person();
                person2.name = 'ZXX';
                console.log(person2.name,person2.prototype); // ZXX

> 函数的 prototype 到底指向什么呢?是这个函数的原型?

其实,函数的 prototype 属性指向一个对象,这个对象正是调用该构造函数而创建的实例的原型,也正是 person1 和 person2 的原型  
person1 和 person2 都是 Person 的一个实例,但不是一个函数, 因此没有 prototype 属性,他们只是
Function 的一个实例, 而 Person 是一个函数,它们都有 prototype 属性,
那什么是原型呢?  
可以这样理解:每一个 javaScript 对象(null 除外)在创建的时候与之关联另一个对象,这个对象就是我们所说的原型,每一个对象都从原型中继承属性

![这是图片](/images/4.png)

这里要求清楚两个概念

1. js 分为函数对象和普通对象,每个对象都有*proto*属性,但只有函数才有 Prototype 属性

- 此处补充一个开发技巧
  ![这是图片](/images/3.png)

#### 3. **proto**

> 这是每个 javaScript 对象都具有的一个属性, 叫*proto*,这个属性会指向该对象的原型

                function Person() {

                }
                var person = new Person();
                console.log(person.__proto__ === Person.prototype); // true

用一张图表示实例原型和构造函数之间的关系

![这是图片](/images/6.png)

> 既然实例对象和构造函数都可以指向原型,那么原型是否有属性指向构造函数或者实例呢?

#### 4.constructor

> 指向实例倒是没有,因为一个构造函数可以生成多个实例,但是原型指向构造函数倒是有的,这里讲到第三个属性:constructor 每一个原型都有一个 constructor 属性指向关联的构造函数

验证一下:

                function Person() {

                }

                var person1 = new Person();

                console.log(Person === Person.prototype.constructor); // true

更新下关系图:

![这是图片](/images/7.png)

到这里 , 我们可以得到一下结论:

                function Person() {

                }

                var person1 = new Person();
                console.log(Person === Person.prototype.constructor); // true
                console.log( person1.__proto  = Person.prototype); // true
                ES5有个方法,也可以获得对象的原型
                console.log(Object.getPrototypeOf(person) === Person.prototype) // true

〉 综上: 我们已经了解到实例,构造函数,实例原型之间的关系 , 接下来我们再聊聊实例与原型的关系

# 6.实例与原型

> 当读取实例的属性时, 如果找不到,就会查找与对象关联的原型中的属性,如果还找不到,会一直找到最顶层为止

举个例子:

            function Person(){

            }

            Person.prototype.name = 'LLF';
            var person1  = new Person();
            person1.name = 'ZXX';
            delete person1.name;
            console.log(person1.name) //LLF
            // ! 这里需要讲一个很绕的点: 实例的隐式原型是构造函数的原型,构造函数的原型的原型又是Object的原型,Object的原型的原型又是null
            console.log(person1.__proto__ === Person.prototype, 222222222) // true
            console.log(Person.prototype.__proto__ === Object.prototype, 222222222) // true
            console.log(Object.prototype.__proto__ === null, 222222222) // true

# 7.原型的原型

> 前面讲到原型也是对象, 既然是对象, 就可以用最原始的方式创建它,那就是:

                var obj = new Object();
                obj.name = 'LLF'
                console.log(obj.name) // LLF

                Object().prototype = Object.prototype

原型对象都是通过 Object 构造函数生成的, 之前讲的实例的**proto**指向构造函数的 prototype, 继续更新图:

![这是图片](/images/8.png)

# 8.原型链

> 问题来了 Object.**\_proto**的原型呢?
> null

            var obj = new Object();
            obj.name = 'LLF'
            console.log(obj.name) // LLF
            console.log(obj.__proto__ === Object.prototype)  // true
            console.log(Object.prototype.__proto__ === null) // true

所以 Object.prototype.**proto** 的值为 null 跟 Object.prototype 没有原型，其实表达了一个意思。

![这是图片](/images/9.png)

其中蓝色的这条线就是原型链

# 9.补充

#### 1.constructor

> 首先是 constructor 属性，我们看个例子

            function Person() {

            }
            var person = new Person();
            console.log(person.constructor === Person); // true

当读取 constructor 时, person 中并没有,就会从 person 的原型中也就是 Person.prototype 中去读取, 正好原型中有该属性,所以:

            person.constructor === Person.prototype.**proto** //true

#### 2.**proto**

> 其次是 **proto** ，绝大部分浏览器都支持这个非标准的方法访问原型，
> 然而它并不存在于 Person.prototype 中，
> 实际上，它是来自于 Object.prototype ，
> 与其说是一个属性，不如说是一个 getter/setter，
> 当使用 obj.**proto** 时，可以理解成返回了 Object.getPrototypeOf(obj)。

讲到这里 想到继承的概念, 每一个对象都会从原型链上继承属性
实际上真的是这样吗?
继承意味着复制操作，然而 JavaScript 默认并不会复制对象的属性，
相反，JavaScript 只是在两个对象之间创建一个关联，
这样，一个对象就可以通过委托访问另一个对象的属性和函数，所以与其叫继承，委托的说法反而更准确些。

# 10.继承

> ES5 prototype 寄生组合式继承

            function SuperType(name) {
                this.name = name
            }

            SuperType.prototype.sayName = function() {
                console.log(this.name)
            }

            function SubType(name, age) {
                SuperType.call(this, name)
                this.age = age
            }

            function extendPrototype(Sub, Super) {
                Sub.prototype = Object.create(Super.prototype)
                Sub.prototype.constructor = Sub
            }

            extendPrototype(SubType, SuperType)

            SubType.prototype.sayAge = function() {
                console.log(this.age)
            }

            const sub = new SubType('tom', 18)
            sub.sayAge() // 18
            sub.sayName() // tom

> ES6 class 继承

            class SuperType {
                constructor(name){
                    this.name = name;
                }

                sayName(){
                    console.log(this.name)
                }
            }

            class subType extends SuperType{
                constructor(name,age){
                    super(name)
                    this.age = age;
                }
                sayAge(){
                    console.log(this.age);
                }
            }

            const sub = new SubType('tom',18);
            console.log( sub.sayAge(),sub.sayName()) // 18 tom

# 11.闭包

> 正常没有闭包的情况

// 中间别的开发人员对 a 重新赋值的话 就会导致的 a 的值改变, 被全局污染, 如何创建一个私有变量,只能被内部访问,不能被外部访问, 这时就产生了闭包

闭包的作用:可以使变量驻留在内存, 不被回收

            let a = 10

            function count(){
                a++;
                console.log(a)
            }

            count(); 11
            count(); 12
            count(); 13

闭包:

let a = 10

            function count(){
                a++;
                return ()=>{
                    console.log(a);
                }
            }

            count(); 11
            count(); 12
            count(); 13

> 闭包是指有权访问另一个函数中变量的函数

            function SayHi(name){
                return ()=>{
                    console.log(`hi~~${name}`)
                }
            }

            const func  = SayHi('LLF');
            console.log(func());

虽然 SayHi 函数已经执行完, 但其活动对象并没有销毁,func 函数仍然拿着 SayHi 函数中的变量 name,这就是闭包
但也因为闭包引用着另一个函数的变量，导致另一个函数即使不使用了也无法销毁，
所以闭包使用过多，会占用较多的内存，这也是一个副作用。

> 利用闭包实现私有属性

const text =(function(){
let age = 0;
return {
getVal(){return value};
setVal(val){value = val};
}
}())


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