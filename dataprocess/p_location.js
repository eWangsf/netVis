const express = require('express');
var readline = require('readline');
var fs = require('fs');
var os = require('os');

function locationFill(filename, start, end) {
  end = Math.min(end, 5977757);
	console.log(outname, start, end);
	var fWriteName = filename;
  var fWrite = fs.createWriteStream(fWriteName);
	fWrite.write("INSERT INTO `location` (`lat`, `lng`) VALUES ");
  for(var i = start+1; i <= end; i++) {
    var tmp = `("0", "0"), `;
    if(i === end) {
      tmp = `("0", "0"); `;
    }
    fWrite.write(tmp + os.EOL);
  }
}

function locationProcess(filename, start, end) {
  console.log(filename, start, end)
  // return ;
	var fReadName = './checkin.txt';
	var fWriteName = filename;
	var fRead = fs.createReadStream(fReadName);
	var fWrite = fs.createWriteStream(fWriteName);

	var objReadline = readline.createInterface({
		input: fRead,
  })
  
  var index = 1;
  var count = 0;

	objReadline.on('line', (line)=>{
		var infos = line.split('\t');

		var tmp = `update location set lat="${infos[2]}", lng="${infos[3]}", weight=weight+1 where id=${infos[4]};`
		if(index > start && index <= end) {
      fWrite.write(tmp + os.EOL);
      count++;
		} // 下一行
		index ++;
	});

	objReadline.on('close', ()=>{
		console.log('readline close...', filename, count);
	});
}


// for(var i = 1; i < 121; i++) {
// 	var outname = `./sqls/locationsql/fill/locationfill${i}.sql`;
// 	var start = (i-1)*50000;
// 	var end = i*50000;
// 	locationFill(outname, start, end);
// }
for(var i = 1; i < 130; i++) {
	var outname = `./sqls/locationsql/update/locationupdate${i}.sql`;
	var start = (i-1)*50000;
  var end = i*50000;
  locationProcess(outname, start, end);
}

// edgesProcess('./sqls/checkinall.sql', 0, 0)

