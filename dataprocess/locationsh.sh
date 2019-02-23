#!/bin/bash
p="/Users/wangsufei/Desktop/netVis/dataprocess/sqls/locationsql/update"
dbName='netvis'
cd $p;
for f in `ls $p/*.sql`
do
echo $f;
mysql -h localhost -u root -p12345678 $dbName -e "source $f";
mv $f $f.done;
done
echo 'finished!'