'use strict'

const fs = require('fs')


var stream;
stream = fs.createWriteStream("ft1cout.txt");

#define LOG_LEVEL_CRITICAL 0
#define LOG_LEVEL_ERROR    1
#define LOG_LEVEL_WARN     2
#define LOG_LEVEL_INFO     3
#define LOG_LEVEL_DEBUG    4

#ifndef LOG_LEVEL
#define LOG_LEVEL LOG_LEVEL_ERROR
#endif

#define writeLog_critical(obj)
#define writeLog_error(obj)
#define writeLog_warn(obj)
#define writeLog_info(obj)
#define writeLog_debug(obj)


#if (LOG_LEVEL == LOG_LEVEL_CRITICAL)
#define writeLog_critical(obj) logger('critical',obj)
#endif

#if (LOG_LEVEL == LOG_LEVEL_ERROR)
#define writeLog_critical(obj) logger('critical',obj)
#define writeLog_error(obj) logger('error',obj)
#endif

#if (LOG_LEVEL == LOG_LEVEL_WARN)
#define writeLog_critical(obj) logger('critical',obj)
#define writeLog_error(obj) logger('error',obj)
#define writeLog_warn(obj) logger('warn',obj)
#endif

#if (LOG_LEVEL == LOG_LEVEL_INFO)
#define writeLog_critical(obj) logger('critical',obj)
#define writeLog_error(obj) logger('error',obj)
#define writeLog_warn(obj) logger('warn',obj)
#define writeLog_info(obj) logger('info',obj)
#endif

#if (LOG_LEVEL == LOG_LEVEL_DEBUG)
#define writeLog_critical(obj) logger('critical',obj)
#define writeLog_error(obj) logger('error',obj)
#define writeLog_warn(obj) logger('warn',obj)
#define writeLog_info(obj) logger('info',obj)
#define writeLog_debug(obj) logger('debug',obj)
#endif



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
	if ( num <= LOG_LEVEL ) {
		return true
	}
	return false
}


function logger(level,msgObj) {
	if ( checkLevel(level) ) {
		stream.write(`${level} ${msgObj.b}` + msgObj.msg + '\n')
	}
}


var hrstart = process.hrtime()

for ( var i = 0; i < 11000000; i++ ) {
    switch( i%5 ) {
        case 0: {
            writeLog_warn({ 'msg' : 'test string 1'\, 'b' : 2 })
            break;
        }
        case 1: {
            writeLog_error({ 'msg' : 'test string 2'\, 'b' : 2 })
            break;
        }
        case 2: {
            writeLog_debug({ 'msg' : 'test string 3'\, 'b' : 2 })
            break;
        }
        case 3: {
            writeLog_critical({ 'msg' : 'test string 4'\, 'b' : 2 })
            break;
        }
        case 4: {
            writeLog_info({ 'msg' : 'test string 5'\, 'b' : 2 })
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
