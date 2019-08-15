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

#define writeLog_critical(msg)
#define writeLog_error(msg)
#define writeLog_warn(msg)
#define writeLog_info(msg)
#define writeLog_debug(msg)


#if (LOG_LEVEL == LOG_LEVEL_CRITICAL)
#define writeLog_critical(msg) logger('critical',msg)
#endif

#if (LOG_LEVEL == LOG_LEVEL_ERROR)
#define writeLog_critical(msg) logger('critical',msg)
#define writeLog_error(msg) logger('error',msg)
#endif

#if (LOG_LEVEL == LOG_LEVEL_WARN)
#define writeLog_critical(msg) logger('critical',msg)
#define writeLog_error(msg) logger('error',msg)
#define writeLog_warn(msg) logger('warn',msg)
#endif

#if (LOG_LEVEL == LOG_LEVEL_INFO)
#define writeLog_critical(msg) logger('critical',msg)
#define writeLog_error(msg) logger('error',msg)
#define writeLog_warn(msg) logger('warn',msg)
#define writeLog_info(msg) logger('info',msg)
#endif

#if (LOG_LEVEL == LOG_LEVEL_DEBUG)
#define writeLog_critical(msg) logger('critical',msg)
#define writeLog_error(msg) logger('error',msg)
#define writeLog_warn(msg) logger('warn',msg)
#define writeLog_info(msg) logger('info',msg)
#define writeLog_debug(msg) logger('debug',msg)
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


var b = 2
function logger(level,msg) {
	if ( checkLevel(level) ) {
		stream.write(`${level} ${b}` + msg + '\n')
	}
}



var logger = new LogLevel(stream)

var hrstart = process.hrtime()

for ( var i = 0; i < 11000000; i++ ) {
    switch( i%5 ) {
        case 0: {
            writeLog_warn('test string 1')
            break;
        }
        case 1: {
            writeLog_error('test string 2')
            break;
        }
        case 2: {
            writeLog_debug('test string 3')
            break;
        }
        case 3: {
            writeLog_critical('test string 4')
            break;
        }
        case 4: {
            writeLog_info('test string 5')
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
