var fs = require('fs')
var stream;
stream = fs.createWriteStream("t1cout.txt");


var hrstart = process.hrtime()

for ( var i = 0; i < 11000000; i++ ) {
	var str = JSON.stringify({
							 'id' : i,
							 'aa' : i + 1,
							 'cc' : "test" + 1,
							 'zz' : 'sfsdfsdfdsf'
							 })
	stream.write(str + '\n')
}



const NS_PER_SEC = 1e9;
var hrend = process.hrtime(hrstart)
console.log(`etime: ${hrend[0] * NS_PER_SEC + hrend[1]}`);

const used = process.memoryUsage();
for (let key in used) {
  console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
}
