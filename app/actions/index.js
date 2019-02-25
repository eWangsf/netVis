
import api from '../api'
import { GET_HEATMAP_SUCCESS, GET_BOUND_LOCATIONS_SUCCESS, SAVE_CHECKIN_GROUPS, GET_EDGES_SUCCESS, GET_BOUND_USERS_SUCCESS, GET_LOCATION_CHECKINS } from '../constants/actionTypes';
import { heatPageSize } from 'constants/mapconfig';
import { mocklocations, mocklocationusers } from 'constants/test';

var bound_seed = 0;
var cancel_seed = null;

export const get_heat_in_bound = (bounds, successCb=console.log, failCb=console.log) => {
  return (dispatch, getState) => {
    var now = (new Date()).getTime();
    if(cancel_seed) {
      cancel_seed(`${bound_seed} canceled`);
    }

    var { request, cancelseed } = api.post('/checkin/bound', {
      bounds
    }, 1);

    bound_seed = now;
    cancel_seed = cancelseed;
    
    request.then(res => {
      if(res && res.code === 200) {
        var result = res.data;
        result = result.map(item => {
          return {
            coordinates: [+item.lng, +item.lat],
            name: `checkin-${item.id}`,
            lid: item.id,
            uid: item.uid,
            time: item.time
          }
        })
        dispatch({
          type: GET_HEATMAP_SUCCESS,
          data: result
        })
        successCb();
        bound_seed = 0;
        cancel_seed = null;
      }
    })
    .catch(err => {
      console.log(err, err.message)
    })
  }
}

export const get_checkin_group_detail = (checkins, successCb=console.log, failCb=console.log) => {
  return (dispatch, getState) => {
    
    var lmap = {};
    var umap = {};
    checkins.forEach(item => {
      lmap[item.lid] = 1;
      umap[item.uid] = 1;
    });

    dispatch({
      type: SAVE_CHECKIN_GROUPS,
      data: checkins,
      uids: Object.keys(umap),
      lids: Object.keys(lmap)
    })
    var edgespromise = api.post('/edges/users', {
      uids: Object.keys(umap)
    })
    .then(res => {
      if(res && res.data && (res.data instanceof Array)) {
        dispatch({
          type: GET_EDGES_SUCCESS,
          data: res.data
        })
      } else {
        console.warn(res.data);
      }
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
 
 

 
