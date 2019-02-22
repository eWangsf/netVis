const express = require('express');
var readline = require('readline');
var fs = require('fs');
var os = require('os');

function userProcess(filename, start, end) {
  end = Math.min(end, 196585);
	var fWriteName = filename;
  var fWrite = fs.createWriteStream(fWriteName);
	fWrite.write("INSERT INTO `user` (`option`) VALUES ");
  for(var i = start+1; i <= end; i++) {
    var tmp = `(""), `;
    if(i === end) {
      tmp = `(""); `;
    }
    fWrite.write(tmp + os.EOL);
  }
}

for(var i = 1; i < 5; i++) {
	var outname = `./sqls/usersql/user${i}.sql`;
	var start = (i-1)*50000;
	var end = i*50000;
	console.log(outname, start, end);
	userProcess(outname, start, end);
}
// edgesProcess('./sqls/checkinall.sql', 0, 0)

