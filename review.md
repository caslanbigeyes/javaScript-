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

// ***错误理解***

**每个函数都有一个 Prototype 属性, 同时Object也有**

![这是图片](/images/1.png)

// ***更正***
**只有函数对象才有prototype属性, 普通的实例对象是没有的**




                function Person(){

                }

                var person1= new Person();
                person1.name = 'LLF';
                console.log(person1.name,person1.prototype); // LLF undefined
                 var person2 = new Person();
                person2.name = 'ZXX';
                console.log(person2.name,person2.prototype); // ZXX

> 函数的prototype到底指向什么呢?是这个函数的原型?

其实,函数的prototype属性指向一个对象,这个对象正是调用该构造函数而创建的实例的原型,也正是person1和person2的原型  
person1和person2 都是Person的一个实例,但不是一个函数, 因此没有prototype属性,他们只是
Function的一个实例, 而Person是一个函数,它们都有prototype属性,
那什么是原型呢?                         
可以这样理解:每一个javaScript对象(null除外)在创建的时候与之关联另一个对象,这个对象就是我们所说的原型,每一个对象都从原型中继承属性

    
![这是图片](/images/4.png)


这里要求清楚两个概念
1. js分为函数对象和普通对象,每个对象都有_proto_属性,但只有函数才有Prototype属性

* 此处补充一个开发技巧
![这是图片](/images/3.png)


#### 3. __proto__
> 这是每个javaScript对象都具有的一个属性, 叫_proto_,这个属性会指向该对象的原型


                function Person() {

                }
                var person = new Person();
                console.log(person.__proto__ === Person.prototype); // true

用一张图表示实例原型和构造函数之间的关系

![这是图片](/images/6.png)
