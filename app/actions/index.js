
import api from '../api'
import { GET_BOUND_LOCATIONS_SUCCESS, GET_BOUND_USERS_SUCCESS, GET_LOCATION_CHECKINS } from '../constants/actionTypes';
import { heatPageSize } from 'constants/mapconfig';
import { mocklocations, mocklocationusers } from 'constants/test';

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
        successCb(res.data);
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
 
 

 
