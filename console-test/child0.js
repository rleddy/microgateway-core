




var fs = require('fs')
var stream;
stream = fs.createWriteStream("t1cout.txt");


var generic = {
    "id" : 12,
    "datum" : "last"
}

process.on('message',(msg) => {
    generic.datum = msg
    var rp = JSON.stringify(generic)
    stream.write(generic + '\n')
})

process.send({msg: 'ready'})