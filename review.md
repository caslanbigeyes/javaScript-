# 1.Object.protoType(对象原型)


> spacify('hello world') // => 'h e l l o  w o r l d'
####转化
function spacify(str) {
    return str.split('').join(' ')
}


> ('hello world').spacify 能放在对象上面 类似这样 
####考察原型
String.prototype.spacify =()=>{
    return str.split('').join(' ')
}


