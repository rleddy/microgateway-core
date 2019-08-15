'use strict'

const fs = require('fs')


var stream;
stream = fs.createWriteStream("ft1cout.txt");












function checkLevel(level) {
	var num = 0
	if ( level == 'critical' ) {
		num = 0
	} else if ( level === 'error' ) {
		num = 1
	} else if ( level === 'warn' ) {
		num = 2
	} else if ( level === 'info' ) {
		num = 3
	} else if ( level === 'debug' ) {
		num = 4
	}
	if ( num <= 0 ) {
		return true
	}
	return false
}


function logger(level,msgObj) {
	if ( checkLevel(level) ) {
		stream.write(`${level} ${msgObj.b}` + msgObj.msg + 'n')
	}
}


var hrstart = process.hrtime()

for ( var i = 0; i < 11000000; i++ ) {
    switch( i%5 ) {
        case 0: {
            
            break;
        }
        case 1: {
            
            break;
        }
        case 2: {
            
            break;
        }
        case 3: {
            logger('critical',{ 'msg' : 'test string 4', 'b' : 2 })
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
