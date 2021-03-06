
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




function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

var wsServer = null;
function wsconnect() {
  if(wsServer) {
    return ;
  }
  wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
  });

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
            var start = 1,
                end = 30000;
            console.log('Received INIT_REQUEST: ', message.utf8Data, start, end);
              // router.readEdgeByLine(connection, start, end);
              router.saveCheckins(connection, start, end);
            
            // var readlineinterval = null;
            // readlineinterval = setInterval(() => {
            //   router.readEdgeByLine(connection, index);
            //   index++;
            //   if(index > 500) {
            //     clearInterval(readlineinterval);
            //     connection.sendUTF('EDGE_DATA_END')
            //   }
            // }, 8)
           
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
        console.log('websocket reconnected')
        wsconnect();
    });
  });
}
 
wsconnect();

