// import api from '../api'
// import { LOAD_DATASOURCE_SUCCESS } from '../constants/actionTypes';

// export const get_data = (successCb=console.log, failCb=console.log) => {
//   return (dispatch, getState) => {
    
//     api.get('/nodes')
//     .then((resnodes) => {
//       if(resnodes && resnodes.code === 200) {
//         // console.warn(res.data)
//         // dispatch({
//         //   type: LOAD_DATASOURCE_SUCCESS,
//         //   data: res.data
//         // })

//         api.get('/edges')
//         .then((res) => {
//           if(res && res.code === 200) {
//             dispatch({
//               type: LOAD_DATASOURCE_SUCCESS,
//               nodes: resnodes.data,
//               edges: res.data
//             })
//           }
//         })
//         .catch(err => {
//           // failCb();
//         })
//       }
//     })
//     .catch(err => {
//       // failCb();
//     })
//   }
// }

import api from '../api'
import { LOAD_DATASOURCE_SUCCESS } from '../constants/actionTypes';
import { inherits } from 'util';
var W3CWebSocket = require('websocket').w3cwebsocket;

const INIT_TYPE = 'INIT_DATA';

export const get_data = (successCb=console.log, failCb=console.log) => {
  return (dispatch, getState) => {
    var client = new W3CWebSocket('ws://localhost:8081/', 'echo-protocol');
    client.onerror = function() {
      console.log('Connection Error');
    };
    client.onopen = function() {
      console.log('WebSocket Client Connected');
      client.send(INIT_TYPE);
    };
    client.onclose = function() {
        console.log('echo-protocol Client Closed');
    };
    
    client.onmessage = function(e) {
        if (typeof e.data === 'string') {
          console.log("Received: ", JSON.parse(e.data));
        }
    };



  }
}

 
 

 
