precodename=gt$1.js
codename = gr$1.js

$level = 0
gpp +n -DLOG_LEVEL=$level $precodename > $codename
#
node $codename > gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename >> gdat$1.txt
#
node zgodat.js $1 $level > gstats$1-$level.dat

$level = 1
gpp +n -DLOG_LEVEL=$level $precodename > $codename
#
node $codename > gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename >> gdat$1.txt
#
node zgodat.js g$1 $level > gstats$1-$level.dat

$level = 2
gpp +n -DLOG_LEVEL=$level $precodename > $codename
#
node $codename > gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
#
node zgodat.js $1 $level > gstats$1-$level.dat

$level = 3
gpp +n -DLOG_LEVEL=$level $precodename > $codename
#
node $codename  > gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
#
node zgodat.js $1 $level > gstats$1-$level.dat

$level = 4
gpp +n -DLOG_LEVEL=$level $precodename > $codename
#
node $codename > gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
echo "====" >> gdat$1.txt
node $codename  >> gdat$1.txt
#
node zgodat.js $1 $level > gstats$1-$level.dat
