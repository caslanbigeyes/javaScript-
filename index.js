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