var express = require('express');
var request = require('request');
var router = express.Router();
const fs = require('fs');
const readline = require('readline');
const path = require('path');
let checkinfilepath = path.join(__dirname, '../data/checkin.txt')

var checkin = require('../checkin/checkin.js');
var location = require('../location/location.js');
var edge = require('../edge/edge.js');


router.post('/checkin/bound',  (req, res, next) => {
	checkin.getInBound(req, res, next);
})

router.post('/edges/users', (req, res, next) => {
	edge.getEdgesByOneSide(req, res, next);
})


// router.get('/location/heat', (req, res, next) => {
// 		location.getLocationHeat(req, res, next);
// })

// router.post('/location/inboundlocations', (req, res, next) => {
// 	location.getLocationInBound(req, res, next);
// })

// router.post('/location/inboundcheckins', (req, res, next) => {
// 	checkin.getInBound(req, res, next);
// })

// router.get('/location/checkin', (req, res, next) => {
// 	checkin.getByLocation(req, res, next);
// })

module.exports = router;


// const fs = require('fs');
// const readline = require('readline');
// const path = require('path');
// const mysql = require('mysql');
// var $util = require('../util/util.js');
// var $conf = require('../conf/db.js');

// var pool = mysql.createPool($util.extend({}, $conf.mysql));
// console.log(pool)

// let nodefilepath = path.join(__dirname, '../data/nodes.json')
// let edgefilepath = path.join(__dirname, '../data/edges.json')

// var router = {
//   saveCheckins() {
//     pool.getConnection(function(err, connection) {
//         console.log(connection);
//         return ;
//     });
//   },
//   readEdgesAll(connection) {
//     let input = fs.createReadStream(edgefilepath);
//     const rl = readline.createInterface({
//       input: input
//     });
//     var startTime = (new Date()).getTime();
//     var linecount = 1;
//     rl.on('line', function (data) {
//       if(linecount <= 5000) {
//         // console.log(data, linecount)
//         connection.sendUTF(data);
//       }
//       linecount++;
//     })
//     rl.on('end', function() {
//       var endTime = (new Date()).getTime();
//       console.log((endTime - startTime) / (1000), 's');
//     })
//   },
//   readNodeAll(connection) {
//       let input = fs.createReadStream(nodefilepath);
//       const rl = readline.createInterface({
//         input: input
//       });
//       var linecount = 1;
//       rl.on('line', function (data) {
//         if(linecount <= 10) {
//           console.log(data, linecount)
//           connection.sendUTF(data);
//         }
//         linecount++;
//       })
//   },
//   readEdgeLines(connection, start=1, end=100) {
//     let input = fs.createReadStream(edgefilepath);
//     const rl = readline.createInterface({
//       input: input
//     });
//     var linecount = 1;
//     rl.on('line', function (data) {
//       if(linecount >= start && linecount <= end) {
//         // console.log(data, linecount)
//         setTimeout(() => {
//           connection.sendUTF(data);
//         }, linecount * 10);
//       }
//       if(linecount === end + 1) {
//         console.log('EDGE_DATA_END');
//         setTimeout(() => {
//           connection.sendUTF('EDGE_DATA_END')
//         }, (end+1) * 10);
//       }
//       linecount++;
//     })
//   },
//   readEdgeByLine(connection, targetlinecount) {
//     let input = fs.createReadStream(edgefilepath);
//     const rl = readline.createInterface({
//       input: input
//     });
//     var linecount = 1;
//     rl.on('line', function (data) {
//       if(linecount == targetlinecount) {
//         // console.log(data, linecount)
//         connection.sendUTF(data);
//       }
//       linecount++;
//     })
//   }
// }

// module.exports = router;









// // const express = require('express');
// // const path = require('path');
// // const readline = require('readline');
// // var router = express.Router();
// // var fs = require('fs');

// // router.get('/nodes', (req, res, next) => {
// //   let filepath = path.join(__dirname, '../data/nodes_test.txt')
// //   let input = fs.createReadStream(filepath)
// //   const rl = readline.createInterface({
// //     input: input
// //   });
  
// //   rl.on('close', function (data) {
// //     if(data) {
// //       res.json({
// //         code: 200,
// //         data: data
// //       })
// //     } else {
// //       res.json({
// //         code: 1,
// //       })
// //     }
    
// //   })
	
// // })

// // router.get('/edges', (req, res, next) => {
// //   fs.readFile(path.join(__dirname, '../data/edges_test.txt'), 'utf-8', function (err, data) {
// //     if(data) {
// //       data = data.split(" ");

// //       res.json({
// //         code: 200,
// //         data: data
// //       })
// //     } else {
// //       res.json({
// //         code: 1,
// //         err
// //       })
// //     }
    
// //   })
	
// // })

// // module.exports = router;


