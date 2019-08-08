'use strict'

const fs = require('fs')


var stream;
stream = fs.createWriteStream("t1cout.txt");



var logger = (level,msgObj) => {
    if (  msgObj !== undefined ) {
        if ( level === 'warn' && (msgObj !== undefined) ) {
            stream.write(`w ${msgObj.b} ` + msgObj.msg + '\n')
        } else if ( level === 'error' && (msgObj !== undefined) ) {
            stream.write(`e ${msgObj.b} ` + msgObj.msg + '\n')
        } else if ( level === 'debug' && (msgObj !== undefined) ) {
            stream.write(`i ${msgObj.b} ` + msgObj.msg + '\n')
        } else if ( level === 'critical' && (msgObj !== undefined) ) {
            stream.write(`i ${msgObj.b} ` + msgObj.msg + '\n')
        } else if ( level === 'info' && (msgObj !== undefined) ) {
            stream.write(`i ${msgObj.b} ` + msgObj.msg + '\n')
        }
    }
}

var hrstart = process.hrtime()

for ( var i = 0; i < 11000000; i++ ) {
    switch( i%5 ) {
        case 0: {
            logger('warn',{ 'msg' : 'test string 1', 'b' : 2 })
            break;
        }
        case 1: {
            logger('error',{ 'msg' : 'test string 2', 'b' : 2 })
            break;
        }
        case 2: {
            logger('debug',{ 'msg' : 'test string 3', 'b' : 2 })
            break;
        }
        case 3: {
            logger('critical',{ 'msg' : 'test string 4', 'b' : 2 })
            break;
        }
        case 4: {
            logger('info',{ 'msg' : 'test string 5', 'b' : 2 })
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