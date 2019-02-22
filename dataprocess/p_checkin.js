const express = require('express');
var readline = require('readline');
var fs = require('fs');
var os = require('os');

function edgesProcess(filename, start, end) {
	var fReadName = './checkin.txt';
	var fWriteName = filename;
	var fRead = fs.createReadStream(fReadName);
	var fWrite = fs.createWriteStream(fWriteName);

	var objReadline = readline.createInterface({
		input: fRead,
	})
	fWrite.write("INSERT INTO `checkin` (`uid`, `time`, `lid`, `lat`, `lng`) VALUES ");

	var index = 1;

	objReadline.on('line', (line)=>{
		var infos = line.split('\t');

		var date = new Date(infos[1]);

		var tmp = `(${infos[0]}, "${date.getTime()}", ${infos[4]}, "${infos[2]}", "${infos[3]}"), `;
		if(index === end-1) {
			tmp = `(${infos[0]}, "${date.getTime()}", ${infos[4]}, "${infos[2]}", "${infos[3]}"); `;
		}
		if(index >= start && index < end) {
			fWrite.write(tmp + os.EOL);
		} // 下一行
		index ++;
	});

	objReadline.on('close', ()=>{
		console.log(index);
		console.log('readline close...', filename);
	});
}

// for(var i = 1; i < 130; i++) {
// 	var outname = `./sqls/checkin${i}.sql`;
// 	var start = (i-1)*50000;
// 	var end = i*50000;
// 	console.log(outname, start, end);
// 	edgesProcess(outname, start, end);
// }
// edgesProcess('./sqls/checkinall.sql', 0, 0)

