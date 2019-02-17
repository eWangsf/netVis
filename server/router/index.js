const fs = require('fs');
const readline = require('readline');
const path = require('path');

let nodefilepath = path.join(__dirname, '../data/edges.json')

var router = {
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

    // connection.sendUTF('233');
    //     setTimeout(() => {
    //     connection.sendUTF('2331');
          
    //     }, 1000);
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


