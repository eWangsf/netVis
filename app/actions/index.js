
import api from '../api'
import { GET_HEATMAP_SUCCESS, SAVE_CHECKIN_GROUPS, GET_EDGES_SUCCESS,
  GET_HOTSPOTS_SUCCESS,
  GET_LOCATION_CHECKINS
  } from '../constants/actionTypes';

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

export const get_hotspots = (successCb=console.log, failCb=console.log) => {
  return (dispatch, getState) => {
    api.get('location/hotspots')
      .then(res => {
        if(res && res.code === 200) {
          dispatch({
            type: GET_HOTSPOTS_SUCCESS,
            data: res.data
          })
          successCb(res.data);
        }
      })
  }
}

export const get_checkins_by_lid = (lid, successCb=console.log, failCb=console.log) => {
  return (dispatch, getState) => {
    api.get('/checkin/bylid', {
      lid
    })
    .then(res => {
      if(res && res.code === 200) {
        var checkins = res.data;

        checkins = checkins.sort((c1, c2) => {
          return c1.time > c2.time ? 1 : -1;
        });
        dispatch({
          type: GET_LOCATION_CHECKINS,
          data: checkins
        })
        // successCb([checkins[0].time, checkins[checkins.length - 1].time])
        successCb()
      }
    })
  }
}


 

 
