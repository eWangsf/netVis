const fs = require('fs');
const readline = require('readline');
const path = require('path');

let nodefilepath = path.join(__dirname, '../data/nodes.json')
let edgefilepath = path.join(__dirname, '../data/edges.json')

var router = {
  readEdgesAll(connection) {
    let input = fs.createReadStream(edgefilepath);
    const rl = readline.createInterface({
      input: input
    });
    var startTime = (new Date()).getTime();
    var linecount = 1;
    rl.on('line', function (data) {
      if(linecount <= 5000) {
        // console.log(data, linecount)
        connection.sendUTF(data);
      }
      linecount++;
    })
    rl.on('end', function() {
      var endTime = (new Date()).getTime();
      console.log((endTime - startTime) / (1000), 's');
    })
  },
  readNodeAll(connection) {
      let input = fs.createReadStream(nodefilepath);
      const rl = readline.createInterface({
        input: input
      });
      var linecount = 1;
      rl.on('line', function (data) {
        if(linecount <= 10) {
          console.log(data, linecount)
          connection.sendUTF(data);
        }
        linecount++;
      })
  },
  readEdgeByLine(connection, targetlinecount) {
    let input = fs.createReadStream(edgefilepath);
    const rl = readline.createInterface({
      input: input
    });
    var linecount = 1;
    rl.on('line', function (data) {
      if(linecount == targetlinecount) {
        // console.log(data, linecount)
        connection.sendUTF(data);
      }
      linecount++;
    })
  }
}

module.exports = router;









// const express = require('express');
// const path = require('path');
// const readline = require('readline');
// var router = express.Router();
// var fs = require('fs');

// router.get('/nodes', (req, res, next) => {
//   let filepath = path.join(__dirname, '../data/nodes_test.txt')
//   let input = fs.createReadStream(filepath)
//   const rl = readline.createInterface({
//     input: input
//   });
  
//   rl.on('close', function (data) {
//     if(data) {
//       res.json({
//         code: 200,
//         data: data
//       })
//     } else {
//       res.json({
//         code: 1,
//       })
//     }
    
//   })
	
// })

// router.get('/edges', (req, res, next) => {
//   fs.readFile(path.join(__dirname, '../data/edges_test.txt'), 'utf-8', function (err, data) {
//     if(data) {
//       data = data.split(" ");

//       res.json({
//         code: 200,
//         data: data
//       })
//     } else {
//       res.json({
//         code: 1,
//         err
//       })
//     }
    
//   })
	
// })

// module.exports = router;


