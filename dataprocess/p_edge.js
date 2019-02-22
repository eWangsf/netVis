const express = require('express');
var readline = require('readline');
var fs = require('fs');
var os = require('os');

function edgeProcess(filename, start, end) {
	start = start ? start : 0;
  end = end ? Math.min(end, 1900654) : 1900654;
	console.log(filename, start, end);

	var fReadName = './edge.txt';
	var fWriteName = filename;
	var fRead = fs.createReadStream(fReadName);
	var fWrite = fs.createWriteStream(fWriteName);

	var objReadline = readline.createInterface({
		input: fRead,
	})
	fWrite.write("INSERT INTO `edge` (`src`, `target`) VALUES ");

	var index = 1;

	objReadline.on('line', (line)=>{
		var infos = line.split('\t');

		var tmp = `("${infos[0]}", "${infos[1]}"), `;
		if(index === end) {
			tmp = `("${infos[0]}", "${infos[1]}"); `;
		}
		if(index > start && index <= end) {
			fWrite.write(tmp + os.EOL);
		} // 下一行
		index ++;
	});

	objReadline.on('close', ()=>{
		console.log(index);
		console.log('readline close...', filename);
	});
}

for(var i = 1; i < 40; i++) {
	var outname = `./sqls/edgesql/edge${i}.sql`;
	var start = (i-1)*50000;
	var end = i*50000;
	edgeProcess(outname, start, end);
}
// edgeProcess('./sqls/edgesql/edgeall.sql')

