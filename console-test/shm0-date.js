
var shm = require('shm-typed-array')
var fs = require("fs")

var buf = shm.create(4096)

console.log(typeof buf)
console.log('[Master] Typeof buf:', buf.constructor.name)

buf.write('this is a test')
console.log(buf.toString())

var hrstart = process.hrtime()

for ( var i = 0; i < 11000000; i++ ) {
  var date = Date.now()
  var d1 = date/1000
  var d2 = date % 1000
  buf.writeUInt32BE(d1)
  buf.writeUInt32BE(d2,4)
  buf.writeUInt32BE(i,8)
  buf.write('a',12,1,'ascii')
}


const NS_PER_SEC = 1e9;
var hrend = process.hrtime(hrstart)
console.log(`etime: ${hrend[0] * NS_PER_SEC + hrend[1]}`);

const used = process.memoryUsage();
for (let key in used) {
  console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
}

