
var fs = require('fs')


var stats = fs.readFileSync('matrixA.json','ascii').toString()
stats = JSON.parse(stats)

var tklist = Object.keys(stats[Object.keys(stats)[0]])

tklist.forEach( tk => {
    if ( tk == 'external' ) return;
    console.log("\n-----------------")
    console.log("TESTING FIELD: " + tk)
    for ( var k1 in stats ) {
        var ww = stats[k1]
        for ( var k2 in stats ) {
            if ( k1 !== k2 && (k1 < k2) ) {
                var tt = stats[k2]
                console.log(`CHECK DIFF: ${k1} ${k2}`)
                checkDiff(ww[tk],tt[tk])
            }
        }
    }           
})



function checkDiff(trial1,trial2) {

    console.log(trial1)
    console.log(trial2)
    //
    var m1 = trial1.mean
    var m2 = trial2.mean

    var s1 = trial1.std
    var s2 = trial2.std

    var z05 =  1.960
    //

    var n = 10  // same for both samples

    var popSzDFScale= 0.5   // scale by the dregrees for freedom for n == n1 == n2

    var Sp = Math.sqrt( popSzDFScale*(s1*s1 + s2*s2) )
    var popSzScale = (2.0/n)


    var Z = (m1 - m2)/(Sp*Math.sqrt(popSzScale))

    var tZ = Math.abs(Z)

    if ( tZ > z05 ) {
        console.log(`abs(Z): ${tZ} > ${z05} : ACCEPT DIFFERENT`)
    } else {
        console.log(`abs(Z): ${tZ} < ${z05} : REJECT DIFFERENT`)
    }

    console.log(Z)
}