'use strict'

const fs = require('fs')


var stream;
stream = fs.createWriteStream("t1cout.txt");

var b = 2
class LogLevel {
    constructor(strm) {
        this.stream = strm
        //this.b = 2
    }

    warn(str) {
        this.stream.write(`w ${b} ` + str + '\n')
    }

    error(str) {
        this.stream.write(`e ${b} ` + str + '\n')
    }

    debug(str) {
        this.stream.write(`d ${b} ` + str + '\n')
    }

    critical(str) {
        this.stream.write(`c ${b} ` + str + '\n')
    }

    info(str) {
        this.stream.write(`i ${b} ` + str + '\n')
    }
}

var logger = new LogLevel(stream)

var hrstart = process.hrtime()

for ( var i = 0; i < 11000000; i++ ) {
    switch( i%5 ) {
        case 0: {
            logger.warn('test string 1')
            break;
        }
        case 1: {
            logger.error('test string 2')
            break;
        }
        case 2: {
            logger.debug('test string 3')
            break;
        }
        case 3: {
            logger.critical('test string 4')
            break;
        }
        case 4: {
            logger.info('test string 5')
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