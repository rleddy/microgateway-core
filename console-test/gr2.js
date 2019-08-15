'use strict'

const fs = require('fs')


var stream;
stream = fs.createWriteStream("ft1cout.txt");












var b = 2
class LogLevel {
    constructor(strm) {
        this.stream = strm
        //this.b = 2
    }
    critical(str) {
        this.stream.write(`c ${b} ` + str + 'n')
    }
    error(str) {
        this.stream.write(`e ${b} ` + str + 'n')
    }
}

var logger = new LogLevel(stream)

var hrstart = process.hrtime()

for ( var i = 0; i < 11000000; i++ ) {
    switch( i%5 ) {
        case 0: {
            
            break;
        }
        case 1: {
            logger.error('test string 2')
            break;
        }
        case 2: {
            
            break;
        }
        case 3: {
            logger.critical('test string 4')
            break;
        }
        case 4: {
            
            break;
        }
    }
}


const NS_PER_SEC = 1e9;
var hrend = process.hrtime(hrstart)
console.log(`etime: ${hrend[0] * NS_PER_SEC + hrend[1]}`);

const used = process.memoryUsage();
for (let key in used) {
  console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
}
