const express = require('express');
var readline = require('readline');
var fs = require('fs');
var os = require('os');


function edgesProcess() {
	var fReadName = './edge.txt';
	var fWriteName = './edge.json';
	var fRead = fs.createReadStream(fReadName);
	var fWrite = fs.createWriteStream(fWriteName);

	var objReadline = readline.createInterface({
		input: fRead,
	})

	var index = 1;

	objReadline.on('line', (line)=>{
		var users = line.split('\t');

		var tmp = `{"id": ${index}, "src": ${users[0]}, "target": ${users[1]}}`;
		fWrite.write(tmp + os.EOL); // 下一行
		
		index ++;
	});

	objReadline.on('close', ()=>{
		console.log('readline close...');
	});
}


function checkinProcess() {
	var fReadName = './checkin.txt';
	var fWriteName = './checkin.json';
	var fRead = fs.createReadStream(fReadName);
	var fWrite = fs.createWriteStream(fWriteName);

	var objReadline = readline.createInterface({
		input: fRead,
	})

	var index = 1;

	objReadline.on('line', (line)=>{
		var infos = line.split('\t');
		var date = new Date(infos[1]);

		var tmp = `{"id": ${index}, "src": ${infos[0]}, "time": ${date.getTime()},  "lat": ${infos[2]},  "lng": ${infos[3]},  "lid": ${infos[4]}}`;
		fWrite.write(tmp + os.EOL); // 下一行
		
		index ++;
	});

	objReadline.on('close', ()=>{
		console.log('readline close...');
	});
}

// edgesProcess();
checkinProcess();


