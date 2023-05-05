# 1.Object.protoType(对象原型)


> 考察spacify('hello world') // => 'h e l l o  w o r l d'

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

            | 函数声明 | 函数表达式 |
            | :------: | :------: |
            | 函数声明创建的函数都是已定义的，这被称为提升 | 函数表达式创建的函数要等执行完才被定义 | 
            | 函数将在执行代码前创建，即使未调用，也占用内存空间 | 函数将在运行阶段执行代码时临时创建,调用完，立即释放，所以更节省内存空间 |
            | 左对齐 | 右对齐 | 居中对齐 |
            | :-----| ----: | :----: |
            | 单元格 | 单元格 | 单元格 |
            | 单元格 | 单元格 | 单元格 |



# 2.参数arguments
> log('hello world')定义log方法

            function log (){
                console.log.apply(console,arguments); // hello
            }

            log('hello');
 
 #### 接着考察call, apply, bind 区分         
> 

1. call，apply，bind都是可以改变函数体内this的指向。                
2. call，apply，bind使用时，传入的第一个参数都是用来传递this的指向的，也就是对上下文的指定           
3. call，apply，bind都是可以传入多个参数，不同的是，call和bind的后续参数都是按照顺序传参，而apply的传参类型是数组；bind的参数可以在函数执行的时候再次添加。



# 3.上下文
> 考察上下文this的理解

                var user = {
                    count:1,
                    getCount:function(){
                        return this.count
                    }
                }
                console.log(user.getCount()); // 1
                var func = user.getCount;
                console.log(func()); // undefined

> 接着考察 怎么保证user总能访问到上下文的this

                var func = user.getCount.bind(user);
                console.log(func()); // undefined


> 又考察如何实现一个bind


                Function.prototype.bind = Function.prototype.bind || function(context){
                    var self = this;
                    return function(){
                        return self.apply(context,arguments);
                    }
                }