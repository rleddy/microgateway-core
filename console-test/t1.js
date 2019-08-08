const fs = require('fs')


var stream;
stream = fs.createWriteStream("t1cout.txt");


var hrstart = process.hrtime()

for ( var i = 0; i < 11000000; i++ ) {
    if ( (i%3) === 0) {
        stream.write('w ' + "test string\n")
    } else if ( i%3 === 1 ) {
        stream.write('e ' + "test string\n")
    } else {
        stream.write('i ' + "test string\n")
    }
}


const NS_PER_SEC = 1e9;
var hrend = process.hrtime(hrstart)
console.log(`etime: ${hrend[0] * NS_PER_SEC + hrend[1]}`);

const used = process.memoryUsage();
for (let key in used) {
  console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
}
