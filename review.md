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

>举例
                var obj1 ={
                    name:'LLF'
                }

                let name  = 'ZXX'

                function bindTest(){
                    console.log(this.name);
                }
                let bindName  =  bindTest();
                console.log(bindName) // ZXX

                let bindName  =  bindTest().bind(obj1);
                console.log(bindName) // LLF

> bind 实现

Function.prototype.myBind = function(context,...args){
    const self = this;
    return function(){
        return self.call(context,args)
    }
}


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

                // 柯里化实现

> 讲一下柯里化
> 接收多个参数变成一个单一的参数(函数第一个参数)的函数, 并且返回接受余下的参数而且返回结果的新函数的技术

简单来说,就是固定一些参数,返回一个接受剩余参数的函数. 实质上就是利用闭包返沪一个延迟执行函数

> 举例

要实现 add(num1,num2)到 add(num1)(num2)的改变,
首先要做的就是将 add 的 return 改造成一个闭包函数,
这样才能连续执行,并且在执行第二个函数的时候,访问到 num1 的参数

                function curriedAdd(num1) {
                return function(num2) {
                return num1 + num2; // 实际上这就是 add(num1, num2);
                }
                }

                function add(num1, num2) {
                return num1 + num2;
                }

                function curry(fn,num1){
                return function(num2){
                return fn(num1,num2)
                }
                }

                const curriedAdd = curry(add,1);

                curriedAdd(2);

                // 多个参数的实现 抽象一下

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

> 拓展一下，怎样实现 add(num1)(num2)(num3)(num4)...、add(num1, num2)(num3)(num4)、add(num1)(num2)(num3, num4)()呢？

思路: 递归  1.找出口
这里想到封装柯里化函数

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






# 13.变量提升
>var 使变量提升 let const 并不会， 提前使用会报错， 使用var关键字声明的或初始化的变量，会将声明语句提升到当前作用域的顶部， 但是， 只有声明才会被触发

##### 三者区别
var 声明的全局变量和函数都能成为windows对象的属性和方法 ，使用let 或者const 声明的变量不会出现全局上下文中 ， 但在作用域链中效果是一样的
 let const 只能被赋值一次  var 能被赋值多次


 # 14.深拷贝与浅拷贝
> 在js中， 除了基本类型，还存在对象、数组这种引用类型 。基本数据类型拷贝的是变量值， 引用类型拷贝变量的地址。


举例
                let obj1 = {a:1};

                let obj2 = obj;

                obj2.a = 4;

                console.log(obj1.a); // 4



# 12.AjAX  
>是客户端创建异步web应用的一种web开发技术

                const xhr = new XMLHttpRequest();
                xhr.onLoad = (res)=>{
                    if(xhr.status===200) {
                        console.log(xhr.response)
                    }
                }

                xhr.open('get', 'https://api.github.com/')
                xhr.send()



除了ajax交互, 还有别的方式交互 例如form , script的src, background的url, fetch, websocket


#### ajax 
优点:
* 1.交互性更好。来自服务器的新内容可以动态更改，无需重新加载整个页面。
* 2.减少与服务器的连接，因为脚本和样式只需要被请求一次。
* 3.状态可以维护在一个页面上。JavaScript 变量和 DOM 状态将得到保持，因为主容器页面未被重新加载。
* 4.基本上包括大部分 SPA 的优点。

缺点:
* 1.动态网页很难收藏。
* 2.如果 JavaScript 已在浏览器中被禁用，则不起作用。
* 3.有些网络爬虫不执行 JavaScript，也不会看到 JavaScript 加载的内容。
* 4.基本上包括大部分 SPA 的缺点。

#### ajax 和 fetch 区别

* 1.ajax 通过 XMLHttpRequest封装,用起来 麻烦 , fetch 来源于Es6
* 2.使用fetch 无法取消请求 基于promise , promise无法做到
* 3.默认情况, fetch 不会发送 或 接收cookies
* 4.fetch没有办法原生监测请求的进度，而XMLHttpRequest可以
* 5.fetch只对网络请求报错，对400，500都当做成功的请求，需要封装去处理
* 6.fetch由于是ES6规范，兼容性上比不上XMLHttpRequest



# 13. 前端面试 (方应杭)

#### 1. react vue 区别 immer.js

vue defineProperty proxy 区别 : 使用 proxy 性能下降 


#### 2. vue 插槽

https://juejin.cn/post/6844903812130422792


#### 3. react 的diff算法  (100行)和vue的diff算法有什么区别

react diff算法:
1. 只对比同层级节点,如果DOM节点跨层级移动. 则不复用
2. 用key来构建一个老节点的map,复用一个后从map里删除
3. lastPlaceIndex 表示最后一个不需要移动节点的索引
4. 移动时的原则尽量少量的移动, 如果有一个必须要动, 新地位高的不动, 低的动

相同点
1. 都是两组虚拟dom的对比, fiber和虚拟dom的对比
2. 只对同级节点进行对比, 简化了算法复杂度
3. 都是用key作为唯一标识, 进行查找, 只有key和标签类型相同才会复用老节点
4. 遍历前都会根据老的节点构建一个map, 方便根据key快速查找

不同点
1. react在进行diff遍历的时候,只对修改的节点进行记录, 形成effect list, 最后才根据effect list 进行真实dom的修改, 修改时先删除, 然后更新与移动, 最后进行插入
2. vue 在遍历的时候就进行了真实dom insertBefore 的方法, 修改了真实 dom, 最后做的真实dom删除操作
3. react 采用单指针从左向右进行遍历
4. vue 采用双指针, 从两头向中间进行遍历
5. react的虚拟diff比较简单, vue中间做了优化处理 最长递增子序列,相对复杂

看三五篇博客  寻找出公共部分

#### 4. react router 如何实现路由守卫

react router 路由守卫 loader 属性
vue 路由守卫 beforeEach  beforeEnter 全局



#### 5. 你在项目中遇到什么问题

二分法 debugger 没有解决不了的问题, 如果有问题 当天我都会去解决 没有过不去的坎




# 14.红绿灯问题
 
function red(){
    console.log(red)
}



# 15.面试题

1. http协议理解

http1.0  无状态 无连接的应用层协议 短连接  每次请求都要建立tcp请求
http2.0  多路复用 并行传输 2.0里每个数据都可以设置优先级和依赖 , 优先级高的数据流会被服务器优先处理和返回客户端 , 一个Tcp上进行任意数量的http请求
http3.0  放弃tcp 使用基于udp的QUIC协议


2. 强缓存和协商缓存 (多理解)

强缓存和协商缓存，etag 详细，if-modify-since 详细，两者的优先级

强缓存: 浏览器不会向服务器发送任何请求，直接从本地缓存中读取文件并返回Status Code: 200 OK 
是利用  expires和cache-control 两个字段控制的, 表示资源的缓存时间

协商缓存: 向服务器发送请求,服务器会根据这个请求的request header的参数判断是否命中协商缓存, 如果命中 则返回304并带上新的response header 通知浏览器从缓存中读取资源 

浏览器点刷新时  是在请求头里加了 Cache-Control: maxAge=0”


3. vue 响应式原理：观察者订阅者模式，2.0 是 defineProproty；3.0 是 proxy

框架实现由三部份
1. 数据劫持(代理)
2. 发布/订阅
3. 模版编译


4. 虚拟 dom 原理






5. antd 4.x实现虚拟表格

实现原理:  设置每一行高度50, 总高度为360, 计算展示区域第一个最后一个距离 + 预留的两个距离, 监听div外层的滚动事件onScroll事件 , 计算scrollTop距离, 计算滚动后的初始位置的距离 , 
Math.floor(e.target.scrollTop/50)  endIndex 为startIndex+总高度 


6. 从输入 url 到浏览器渲染经过了哪些流程

1.从输入url的时候 浏览器就会智能匹配可能的url 会从历史记录 标签里去找对应的url, 给出智能提示 让你补全
2.浏览器查找ip地址 先解析host文件 , 在本地硬盘去查找有没有与这个对应域名的匹配规则, 有的话直接从host里读取, 本地没找到, 本地dns服务器就是你发出电信 移动接入的服务器, 如果本地有缓存,
直接返回, 否则递归查询, 再没有的话去 dns根服务器进行查询

3.浏览器请求到资源后开始解析html以构建dom树 -> 构建render树 -> 布局render树 -> 绘制render树



7. 强缓存，协商缓存；两种方案优势缺点；分别使用情况，使用条件

强缓存:直接读取缓存

协商缓存: 来通过服务器来告知缓存是否可用


eTag 是一个标记 类似md5 文件改动就变了



8. webpack 个性化配置：拆包；less，sass 处理；打包加速优化；dll plugins；图片资源压缩


首先 webpack 5更新了什么?

1. 清除输出目录


                module.exports = {
                    output:{
                        clean:true
                    }
                }

2. top-level-await


                module.exports = {
                    experiments:{
                        topLevelAwait:true
                    }
                }

3. webpack5对模块的合并、作用域提升、tree shaking等处理更加智能

4. 打包缓存开箱即用

                const path = require("path");
                module.exports = {
                    cache:{
                        // 缓存类型，支持：memory、filesystem
                        type:''filesystem
                        // 缓存目录，仅类型为filsystem有效
                        cacheDirectory:path.resolve(__dirname,'node_modules/.cache/webpack')
                    }
                }

5. 资源模块 天生支持 (不需要那些css loader file loader)



9. 四个盒子每个盒子width:25% , 最后一个挤下去了, 1. 可以给父级加一个 font-size:0 2.设置父级display:flex , 字级设置flex:1 , 特别的可以设置width


10. 1px 问题解决方案 
1.0.5px解决方案
2.用图片代替边框
3,background渐变
4.设置viewport


11. html header 头部标签；rem 实现，一般 H5 使用，PC 没咋使用（media）；
1.加入meta标签
等于告诉浏览器网页宽度等于设备屏幕宽度, 且不进行缩放

2.响应式页面的实现
一种是栅格布局, 一种是bootstrap, 一种是媒体查询(设置不同尺寸的页面不同样式)
rem就是设置不同机型下, 不同字体的大小适应

> 利用Js获取设备屏幕的宽度，并根据屏幕的宽度动态改变根元素html的font-siz属性的作用

                //获取html元素
                var html = document.getElementsByTagName('html')[0]; 
                //屏幕的宽度（兼容处理）
                var w = document.documentElement.clientWidth || document.body.clientWidth;
                //750这个数字是根据你的设计图的实际大小来的，所以值具体根据设计图的大小
                html.style.fontSize = w / 750 + "px";

> iphone6 宽度750px 1rem =1px
> iphone5 宽度640PX 640/750 = 0.85px 1rem = 0.85px 


12. 单点登陆实现
> 1. 父域cookie (不支持跨主域名)
> 2. 认证中心
> 3. LocalStorage 跨域 (前端实现 通过iframe+postMessage) 将同一份token写入多个域下的localStorage中 , 每次请求接口之前都去localStorage中读取

关键代码如下:
                // 获取 token
                var token = result.data.token;

                // 动态创建一个不可见的iframe，在iframe中加载一个跨域HTML
                var iframe = document.createElement("iframe");
                iframe.src = "http://app1.com/localstorage.html";
                document.body.append(iframe);
                // 使用postMessage()方法将token传递给iframe
                setTimeout(function () {
                    iframe.contentWindow.postMessage(token, "http://app1.com");
                }, 4000);
                setTimeout(function () {
                    iframe.remove();
                }, 6000);

                // 在这个iframe所加载的HTML中绑定一个事件监听器，当事件被触发时，把接收到的token数据写入localStorage
                window.addEventListener('message', function (event) {
                    localStorage.setItem('token', event.data)
                }, false);




13. new操作符具体做了啥?
1.创建一个新的对象obj
2.将对象与构造函数通过原型链连接起来
3.将构造函数的this绑定到新建的对象obj上
4.根据构造函数返回类型判断,原始值忽略,新对象正常处理


                function mockNew (constructor, ...args) {
                const isPrimitive = result => {
                    // 如果result为值类型则返回true
                    // 如果result为引用类型则返回false    
                }

                const o = Object.create(constructor.prototype)
                const result = constructor.apply(o, args)
                
                return isPrimitive(result) ? o : result
                }





14. z-index 无效问题：生效范围；什么情况下会失效，边界条件
1.父级元素溢出或者不显示,或者子元素在父元素外绝对定位
2.父级元素z-index低
3.没有设置position属性
4.父级元素 position 属性为 relative
5.含有浮动(float)属性



15. 前端如何设计埋点
