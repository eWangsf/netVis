// const express = require('express');
// const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
// const logger = require('morgan');
// const path = require('path');

// const routes = require('./router/index');

// const app = express();
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'dist')));

// app.all('*', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   res.header("Content-Type", "application/json;charset=utf-8");
//   next();
// });
// app.use('/api', routes);

// app.listen(8081, () => console.log('Listening on port 8081!'));

var WebSocketServer = require('websocket').server;
var http = require('http');
var router = require('./router/index.js');

var server = http.createServer(function(request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});
server.listen(8081, function() {
  console.log((new Date()) + ' Server is listening on port 8081');
});

var wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    return;
  }
  
  var connection = request.accept('echo-protocol', request.origin);
  console.log((new Date()) + ' Connection accepted.');

  connection.on('message', function(message) {
      if (message.type === 'utf8') {
        if(message.utf8Data === 'INIT_DATA') {
          console.log('Received INIT_REQUEST: ', message.utf8Data);
          // router.readNodeAll(connection);
          router.readEdgesAll(connection);
          // var index = 1;
          // var readlineinterval = null;
          // readlineinterval = setInterval(() => {
          //   router.readEdgeByLine(connection, index);
          //   index++;
          //   if(index > 30) {
          //     clearInterval(readlineinterval);
          //   }
          // }, 30)
         
        } else {
          console.log('Received Message: ', JSON.stringify(message.utf8Data) );
          connection.sendUTF(message.utf8Data);
        }
      }
      else if (message.type === 'binary') {
          console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
          connection.sendBytes(message.binaryData);
      }
  });
  connection.on('close', function(reasonCode, description) {
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});
