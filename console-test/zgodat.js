var fs = require('fs')



var runnum = parseInt(process.argv[2])

var runs = fs.readFileSync(`gdat${runnum}.txt`).toString()


runs = runs.split('====')

var runner = {
    'etime': [],
    'rss' : [],
    'heapTotal' : [],
    'heapUsed' : [],
    'external' : []
}


runs.forEach(run => {
    var parts = run.split('\n')

    parts.forEach( pp => {
        var [key,data] = (pp.indexOf(':') > 0)  ? pp.split(':') : pp.split(' ')
        var k = key.trim()
        if ( k.length && data ) {
            if ( runner[k] === undefined ) {
                runner[k] = []
            }

            var dat = parseFloat(data)
            runner[k].push(dat)
        }
    })
})


//console.dir(runner,{depth : 4, color : true})


var stats = {
    'etime': {
        mean : 0,
        std : 0
    },
    'rss' : {
        mean : 0,
        std : 0
    },
    'heapTotal' : {
        mean : 0,
        std : 0
    },
    'heapUsed' : {
        mean : 0,
        std : 0
    },
    'external' : {
        mean : 0,
        std : 0
    }
}


const NS_PER_SEC = 1e9;

for ( var k in runner ) {
    var data = runner[k]
    var sum = data.reduce((val,current) => val + current,0.0)
    var n = 1.0*(data.length)
    var mean = sum/n
    if ( k === 'etime' ) {
        stats[k].mean = mean/NS_PER_SEC
        stats[k].std = (Math.sqrt((data.reduce( (val,current) => { return(val + Math.pow((current - mean),2)) },0.0)))/(n-1.0))/NS_PER_SEC
    } else {
        stats[k].mean = mean
        stats[k].std = (Math.sqrt((data.reduce( (val,current) => { return(val + Math.pow((current - mean),2)) },0.0)))/(n-1.0))
    }
}

console.dir(stats,{ depth : 2})

