const express = require('express');
var readline = require('readline');
var fs = require('fs');
var os = require('os');


function nodesProcess() {
	var fReadName = './nodes.txt';
	var fWriteName = './nodes.json';
	var fRead = fs.createReadStream(fReadName);
	var fWrite = fs.createWriteStream(fWriteName);

	var objReadline = readline.createInterface({
		input: fRead,
	})

	var index = 1;

	objReadline.on('line', (line)=>{
		var users = line.split('\t');
		var tmp = `{"src": ${users[0]}, "target": ${users[1]}}`;
		fWrite.write(tmp + os.EOL); // 下一行
		// console.log(index, line);
		index ++;
	});

	objReadline.on('close', ()=>{
		console.log('readline close...');
	});
}


function edgesProcess() {
	var fReadName = './edges.txt';
	var fWriteName = './edges.json';
	var fRead = fs.createReadStream(fReadName);
	var fWrite = fs.createWriteStream(fWriteName);

	var objReadline = readline.createInterface({
		input: fRead,
	})

	var index = 1;

	objReadline.on('line', (line)=>{
		var infos = line.split('\t');

		var date = new Date(infos[1]);

		var tmp = `{"src": ${infos[0]}, "time": ${date.getTime()},  "lat": ${infos[2]},  "lng": ${infos[3]},  "target": ${infos[4]}}`;
		fWrite.write(tmp + os.EOL); // 下一行
		// console.log(index, line);
		index ++;
	});

	objReadline.on('close', ()=>{
		console.log('readline close...');
	});
}

edgesProcess()

