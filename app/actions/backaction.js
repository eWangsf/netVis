
import api from '../api'
import { RECEIVE_EDGE_SUCCESS, GET_BOUND_LOCATIONS_SUCCESS } from '../constants/actionTypes';
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


var bound_seed = 0;
var cancel_seed = null;

export const get_location_heat = (loctioncount, successCb=console.log, failCb=console.log) => {
  return (dispatch, getState) => {
    api.get('/location/heat', {
      pageSize: heatPageSize,
      offset: loctioncount
    })
    .then(res => {
      if(res && res.code === 200) {
        var result = res.data;
        result = result.map(item => {
          return {
            coordinates: [item.lng, item.lat],
            name: `checkin-${item.id}`,
            checkinid: item.id,
          }
        })
        dispatch({
          type: GET_HEATMAP_SUCCESS,
          data: result
        })
        // successCb(result);
      }
    })
  }
}

export const get_locations_in_bound = (latrange, lngrange, successCb=console.log, failCb=console.log) => {
  return (dispatch, getState) => {
    // dispatch({
    //   type: GET_BOUND_LOCATIONS_SUCCESS,
    //   data: mocklocations
    // })
    // successCb(mocklocations)
    // return ;
    var now = (new Date()).getTime();
    if(cancel_seed) {
      cancel_seed(`${bound_seed} canceled`);
    }

    // console.warn('get_locations_in_bound', bound_seed)
    var { request, cancelseed } = api.post('/location/inboundlocations', {
      latrange, 
      lngrange,
      bound_seed: now
    }, 1);

    bound_seed = now;
    cancel_seed = cancelseed;
    
    request.then(res => {
      if(res && res.code === 200 && bound_seed === res.bound_seed) {
        // console.warn('get_locations_in_bound', res.data, res.bound_seed)
        dispatch({
          type: GET_BOUND_LOCATIONS_SUCCESS,
          data: res.data
        })
        successCb(res.data);
        bound_seed = 0;
        cancel_seed = null;
      }
    })
    .catch(err => {
      console.log(err, err.message)
    })
  }
}

export const get_location_checkins_in_bound = (latrange, lngrange, successCb=console.log, failCb=console.log) => {
  return (dispatch, getState) => {
    // dispatch({
    //   type: GET_BOUND_USERS_SUCCESS,
    //   data: mocklocationusers
    // })
    // successCb(mocklocationusers);

    // return ;
    api.post('/location/inboundcheckins', {
      latrange,
      lngrange
    })
    .then(res => {
      if(res && res.code === 200) {
        dispatch({
          type: GET_BOUND_USERS_SUCCESS,
          data: res.data
        })
        successCb(res.data);
      }
    })
  }
}

export const get_location_detail = (lid, successCb=console.log, failCb=console.log) => {
  return (dispatch, getState) => {
    api.get('/location/checkin', {
      lid
    })
    .then(res => {
      if(res && res.code === 200) {
        dispatch({
          type: GET_LOCATION_CHECKINS,
          data: res.data
        })
        successCb();
      }
    })
  }
}
 
 
 

 
