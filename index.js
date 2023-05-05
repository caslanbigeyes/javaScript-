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
    count:1,
    getCount:function(){
        return this.count
    }
}
console.log(user.getCount());

var func = user.getCount;
console.log(func());

// todo:构造函数 
// ? 对象的原型是不是prototype ?


function Person(){

}

var person1= new Person();
person1.name = 'LLF';
console.log(person1.name,person1.prototype); // LLF
 var person2 = new Person();
person2.name = 'ZXX';
console.log(person2.name,person2.prototype); // ZXX



