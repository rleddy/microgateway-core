
const { spawn } = require('child_process')


var logger = spawn("node", [__dirname + '/child0.js'],{
  stdio : ['pipe', 'pipe', 'pipe', 'ipc']
})

logger.on('message', () => {

  console.log('starting')

  var hrstart = process.hrtime()

  for ( var i = 0; i < 1100000; i++ ) {
    logger.send({ msg : 'w'})
  }
    
  const NS_PER_SEC = 1e9;
  var hrend = process.hrtime(hrstart)
  console.log(`etime: ${hrend[0] * NS_PER_SEC + hrend[1]}`);

  const used = process.memoryUsage();
  for (let key in used) {
    console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
  }

})



