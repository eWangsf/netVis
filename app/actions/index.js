
import api from '../api'
import { RECEIVE_EDGE_SUCCESS } from '../constants/actionTypes';
import { heatPageSize } from 'constants/mapconfig';

var W3CWebSocket = require('websocket').w3cwebsocket;

const INIT_TYPE = 'INIT_DATA';

var bufferarray = [];
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
        if(e.data === 'EDGE_DATA_END') {
          dispatch({
            type: RECEIVE_EDGE_SUCCESS,
            data: bufferarray
          })
          bufferarray = [];
          successCb();
          return ;
        }
        if (typeof e.data === 'string') {
          var record = JSON.parse(e.data);
          if(bufferarray.length <= 100) {
            bufferarray.push(record);
          }
          // console.log("Received: ", record);
          dispatch({
            type: RECEIVE_EDGE_SUCCESS,
            data: bufferarray
          })
          bufferarray = [];
        }
    };



  }
}

export const init_data = (loctioncount) => {
  return (dispatch, getState) => {
    api.get('/location/init')
    .then((res) => {
      debugger
    })

  }
}


export const get_location_heat = (loctioncount, successCb=console.log, failCb=console.log) => {
  return (dispatch, getState) => {
    api.get('/location/heat', {
      pageSize: heatPageSize,
      offset: loctioncount
    })
    .then(res => {
      if(res && res.code === 200) {
        successCb(res.data);
      }
    })
  }
}
 
 

 
