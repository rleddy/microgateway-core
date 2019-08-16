
'use strict';

const fs = require('fs');
const mkdir = require('mkdirp');
const os = require('os');
const path = require('path');
const util = require('util');
const configService = require('./config')
const stats = require('./stats')
const assert = require('assert')
const uuid = require('uuid')
const cluster = require('cluster')

const CONSOLE_LOG_TAG = 'microgateway-core logging';

var logger = null;
var logToConsole = false;
module.exports.init = function init(stubConfig, options) {
	if (!process.env.CurrentOrgName && !process.env.CurrentEnvironmentName && options) {
		process.env.CurrentOrgName = options.org;
		process.env.CurrentEnvironmentName = options.env;
	}

  const config = stubConfig || configService.get()
  assert(config, 'must have config')
  assert(config.uid, 'config must have uid');
  const uid = config.uid || uuid.v1();

  const logConfig = config.edgemicro.logging;
  assert(logConfig, 'must have config.edgemicro.logging in config');
  logToConsole = !!logConfig.to_console;

  var rotation = 0;
  const logDir = logConfig.dir || process.cwd();
  var logFilePath = _calculateLogFilePath(logDir, uid, rotation);

  mkdir.sync(logDir);

  statsTimer(logConfig.stats_log_interval);

  // using a WriteStream here causes excessive memory growth under high load (with node v0.12.6, jul 2015)
  var logFileFd;
  var logFailWarn = false;
  var writeInProgress = false;
  var records = [];
  var offset = 0;
  var nextRotation = 0;


  // buffer the write if a write is already in progress
  // https://nodejs.org/api/fs.html#fs_fs_write_fd_data_position_encoding_callback
  // "Note that it is unsafe to use fs.write multiple times on the same file without waiting for the callback."
  const writeLogRecordToFile = function (record,cb) {
    if (Date.now() > nextRotation) {
      rotation++;
     if (logFileFd) {
        fs.close(logFileFd);
      }
      logFilePath = _calculateLogFilePath(logDir, uid, rotation);
      if (cluster.isMaster) {
        if(!logToConsole) {
          writeConsoleLog('log', {component: CONSOLE_LOG_TAG}, 'logging to ' + logFilePath);
        }
      }
   
      logFileFd = fs.openSync(logFilePath, 'a', 0o0600);
      nextRotation = Date.now() + ((logConfig.rotate_interval || 24) * 60 * 60 * 1000); // hours -> ms
    }

    if ( record ) records.push(record);
    if ( writeInProgress || (records.length === 0) ) {
      return record;
    }
    

    writeInProgress = true;
    const buffer = records.join('');
    records = [];

    fs.write(logFileFd, buffer, offset, 'utf8', function (err, written) {
      writeInProgress = false;

      if (err) {
        if (!logFailWarn) {
          // print warning once, dumping every failure to console would overwhelm the console
          writeConsoleLog('warn',{component: CONSOLE_LOG_TAG},'error writing log',err);
          logFailWarn = true;
        }
      } else {
        offset += written;
      }

      if (records.length > 0) {
        process.nextTick(function () {
          writeLogRecordToFile();
        });
      } else {
          if ( cb !== undefined ) {
              try {
                cb();
              } catch (e) {
                writeConsoleLog('log',{component: CONSOLE_LOG_TAG},e);
              }
          }
      }
    });
    return buffer;
  }

  const writeLogRecordToConsole = (record,cb) => {
    if(record) {
      if(record.startsWith('error') || record.startsWith('warn')) {
        writeConsoleLog('error',{component: CONSOLE_LOG_TAG},record);
      } else {
          process.stdout.write(record);
          if ( cb !== undefined ) {
              try {
                cb();
              } catch (e) {
                writeConsoleLog('log',{component: CONSOLE_LOG_TAG},e);
              }
          }
      }
    }
  }

  const writeLog = function (level, obj, msg, isTransactionLog) {
    if (!cluster.isMaster) {
      const rec = serializeLogRecord(level, logConfig.level, obj, msg, isTransactionLog);
      if (process.connected) {
        process.send({level:level, msg: rec});
      }
       return rec;
    }
    return logger.writeLogRecord({msg:serializeLogRecord(level, logConfig.level, obj, msg, isTransactionLog)});
  }
  logger = {
    trace: function (obj, msg) {
      return writeLog('trace', obj, msg);
    },
    debug: function (obj, msg) {
      return writeLog('debug', obj, msg);
    },
    info: function (obj, msg) {
      return writeLog('info', obj, msg);
    },
    warn: function (obj, msg) {
      return writeLog('warn', obj, msg);
    },
    error: function (obj, msg) {
      return writeLog('error', obj, msg);
    },
    eventLog: function (obj, msg) {
      if ( obj.level ) {
        return writeLog(obj.level, obj, msg, true);
      } else {
        return null;
      }
    },
    consoleLog: function (level, obj, ...data) {
      return writeConsoleLog(level, obj, ...data);
    },
    stats: function (statsInfo, msg) {
      return writeLog('stats', { stats: statsInfo }, msg);
    },
    setLevel: function (level) {
      logConfig.level = level;
    },
    writeLogRecord: function(record,cb) {              
      const writeRecordToOutput = logToConsole ? writeLogRecordToConsole : writeLogRecordToFile;
      if ( record && record.msg ) writeRecordToOutput(record.msg,cb);
      return record;
    }
  };


  if (cluster.isMaster) {
    if(logToConsole) {
      writeConsoleLog('log',{component: CONSOLE_LOG_TAG},'logging to console');
    } 

    Object.keys(cluster.workers).forEach((id) => {
      cluster.workers[id].on('message', function (msg) {
        if ( msg && msg.msg ) logger.writeLogRecord(msg.msg);
      });
    });
  }


  return logger;
}
module.exports.getLogger = function () {
  return logger;
}

const writeConsoleLog = function (level, obj, ...dataList) {
  // uncomment the below condition to disable the blank console logs
  if ( console[level] /*&& dataList && dataList.length > 0*/ ) {
    const Timestamp = new Date().toISOString();
    let ProcessId = '';
    if (cluster.isMaster) {
      ProcessId = process.pid;
    } else if (cluster.isWorker) {
      ProcessId = cluster.worker.id;
    }
    let component = '';
    if (obj && obj.component ) {
      component = obj.component;
    }
    let message = Timestamp + ' ['+ ProcessId + ']'+ ' ['+ component + ']';
      console[level](message, util.format(...dataList));
  }
}

module.exports.writeConsoleLog =  writeConsoleLog;

// choose certain properties of req/res/err to include in log records, pass the rest through
// be extra careful to not throw an error here
// - by inadvertently dereferencing any null/undefined objects
function serializeLogRecord(level, configLevel, obj, text, isTransactionLog) {
  if (configLevel === 'none') {
    return null;
  }
  switch (level) {
    case 'trace': {
      if (configLevel === 'error' || configLevel === 'warn' || configLevel === 'info' || configLevel === 'debug') {
        return null;
      }
      break;
    }
    case 'debug': {
      if (configLevel === 'error' || configLevel === 'warn' || configLevel === 'info') {
        return null;
      }
      break;
    }
    case 'info': {
      if (configLevel === 'error' || configLevel === 'warn') {
        return null;
      }
      break;
    }
    case 'warn': {
      if ( configLevel === 'error' ) {
        return null;
      }
      break;
    }
  }

  const record = {};
  if (typeof obj === 'string') {
    if (text) text = text + ' ' + obj; // append obj to text
    else text = obj; // assign obj to text
  } else if (obj) Object.keys(obj).forEach(function (key) {
    if (key === 'req') {
      const req = obj[key];
      if (req) {
        record.m = req.method;
        record.u = req.url;
        record.h = (req.headers ? req.headers.host : '');
        record.clientId = (req.headers ? req.headers['x-api-key'] : '');
        record.r = (req.socket ? (req.socket.remoteAddress + ':' + req.socket.remotePort) : ':0');
        if( !record.clientIP && !isValidIPaddress(record.clientIP) ){ // if valid IP is already taken from res then ignore
          record.clientIP = ( (req.socket && req.socket.remoteAddress) ? req.socket.remoteAddress : '');
        }
      }
    } else if (key === 'res') {
      const res = obj[key];
      if (res) {
        record.s = res.statusCode;
        let peerdata = '';
        if (res.socket && res.socket._peername && res.socket._peername.address) {
          peerdata = res.socket._peername.address;
        }
        if( !record.clientIP && !isValidIPaddress(record.clientIP)) { // if valid IP is already taken from req then ignore
          record.clientIP = peerdata;
        }
      }
    } else if (key === 'err') {
      const err = obj[key];
      if (err) {
        record.name = err.name;
        record.message = err.message;
        record.code = err.code;
        record.stack = err.stack;
      }
    } else if (key === 'stats') {
      const stats = obj[key];
      if (stats) {
        Object.keys(stats).forEach(function (key) {
          if (key === 'statusCodes') {
            const codes = stats[key];
            record[key] = '{' + Object.keys(codes).map(function (code) {
              return code + '=' + codes[code];
            }).join(', ') + '}'
          } else {
            record[key] = stats[key];
          }
        });
      }

      const mem = process.memoryUsage();
      record.rss = mem.rss;

      const cpus = os.cpus();
      const userTimes = [];
      cpus.forEach(function (cpu) {
        userTimes.push(cpu.times.user);
      });
      record.cpu = '[' + userTimes.join(', ') + ']';
    } else {
      record[key] = obj[key];
    }
  });

  if (isTransactionLog) {
    return serializeEventLogRecord(level, record, text);
  }
  const preamble = Date.now() + ' '

  var message =preamble +
    level + ' ' +
    (text ? text + ' ' : '') +
    Object.keys(record).map(function (key) {
      return key + '=' + record[key]; // assumes vaules are primitive, no recursion
    }).join(', ') +
    os.EOL;

  return message;

}

function statsTimer(statsLogInterval) {
  // periodically log stats, but not if idle (no new requests or responses)

  if (typeof statsLogInterval === 'number' && statsLogInterval > 0) {
    var lastRequests = 0;
    var lastResponses = 0;
    const logTimer = setInterval(function () {
      const statsInfo = stats.getStats();
      if (lastRequests !== statsInfo.requests && lastResponses !== statsInfo.responses) {
        lastRequests = statsInfo.requests;
        lastResponses = statsInfo.responses;
        logger.stats(statsInfo);
      }
    }, statsLogInterval * 1000); // convert seconds to milliseconds
    logTimer.unref(); // don't keep event loop alive just for logging stats
  }
}

const _calculateLogFilePath = (logDir, uid, rotation) => {
  const baseFileName = util.format('edgemicro-%s-%s-%d-api.log', os.hostname(), uid, rotation);
  const logFilePath = path.join(logDir, baseFileName);
  return logFilePath;
};

const isValidIPaddress = (ipaddress) =>
{
 if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress))
  {
    return (true)
  }
  return (false)
}

const serializeEventLogRecord = (level, record, text) => {
  const Timestamp = new Date().toISOString();
  const hostname = record.h || '';
  let ProcessId = '';
  if (cluster.isMaster) {
    ProcessId = process.pid;
  } else if (cluster.isWorker) {
    ProcessId = cluster.worker.id;
  }
  const Org = process.env.CurrentOrgName;
  const Environment = process.env.CurrentEnvironmentName;
  const APIProxy = record.u ? record.u.replace('/','') : '';
  let ClientIp = record.clientIP ? record.clientIP.replace('::ffff:','') : '';
  if ( !isValidIPaddress(ClientIp) ) {
    ClientIp = '';
  }
  const ClientId = record.clientId || '';
  const component = record.component || '';
  let reqMethod = record.m || '';
  let respStatusCode = record.s || '';
  let errMessage = record.message || '';
  let errCode = record.code || '';
  let customMessage =  ( text && text !== undefined ) ? text : '';
  let correlationId = record.i || '';
  let timeTaken = record.d || '';
  let errorStack =  record.stack || '';

  let message = Timestamp + ' ['+ level + ']'
  + '['+ hostname +']'
  + '['+ ProcessId +']'
  + '['+ Org +']'
  + '['+ Environment +']'
  + '['+ APIProxy +']'
  + '['+ ClientIp +']'
  + '['+ ClientId +']'
  + '['+ correlationId +']'
  + '['+ component +']'
  + '['+ customMessage +']'
  + '['+ reqMethod +']'
  + '['+ respStatusCode +']'
  + '['+ errMessage +']'
  + '['+ errCode +']'
  + '['+ timeTaken +']'
    +os.EOL;

  if ( level === 'trace' ) {
    message += errorStack + os.EOL;
  }

  return message;
}

module.exports._calculateLogFilePath = _calculateLogFilePath;
