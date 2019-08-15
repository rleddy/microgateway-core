var fs = require('fs')
var stream;
stream = fs.createWriteStream("t1cout.txt");


var hrstart = process.hrtime()

for ( var i = 0; i < 11000000; i++ ) {
	stream.write('w\n')
}



const NS_PER_SEC = 1e9;
var hrend = process.hrtime(hrstart)
console.log(`etime: ${hrend[0] * NS_PER_SEC + hrend[1]}`);

const used = process.memoryUsage();
for (let key in used) {
  console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
}
