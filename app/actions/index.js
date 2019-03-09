
import api from '../api'
import { GET_HEATMAP_SUCCESS, SAVE_CHECKIN_GROUPS, GET_EDGES_SUCCESS, GET_USERS_CHECKIN_TOTAL_SUCCESS,
  GET_HOTSPOTS_SUCCESS,
  GET_LOCATION_CHECKINS,
  GET_LOCATIONS_BY_USERS
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
        
        result.forEach(item => {
          item.name= `checkin-${item.id}`,
          item.coordinates =  [+item.lng, +item.lat],
          item.lat = +item.lat,
          item.lng = +item.lng,
          item.lid = +item.lid,
          item.uid = +item.uid,
          item.time = +item.time;
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
      if(!lmap[item.lid]) {
        lmap[item.lid] = {
          count: 0,
          users: [],
          usermap: {}
        }
      }
      if(!umap[item.uid]) {
        umap[item.uid] = {
          count: 0,
          checkins: []
        }
      }
      lmap[item.lid].count ++;
      if(!lmap[item.lid].usermap[item.uid]) {
        lmap[item.lid].usermap[item.uid] = {
          uid: item.uid,
          count: 0
        };
      }
      lmap[item.lid].usermap[item.uid].count ++;
      if(!lmap[item.lid].users.includes(item.uid)) {
        lmap[item.lid].users.push(+item.uid);
      }
      umap[item.uid].count ++;
      umap[item.uid].checkins.push(item);
    });

    dispatch({
      type: SAVE_CHECKIN_GROUPS,
      checkins: checkins,
      locationtree: Object.keys(lmap).map(item => {
        return {
          lid: +item,
          count: lmap[item].count,
          users: lmap[item].users,
          usermap: lmap[item].users.map(item2 => lmap[item].usermap[item2])
        }
      }),
      usertree: Object.keys(umap).map(item => {
        return {
          uid: +item,
          color: `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 1)`,
          count: umap[item].count,
          checkins: umap[item].checkins
        }
      })
    })
    api.post('/checkin/total/users', {
      uids: Object.keys(umap)
    })
    .then(res => {
      if(res && res.data && (res.data instanceof Array)) {
        dispatch({
          type: GET_USERS_CHECKIN_TOTAL_SUCCESS,
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
    api.get('/location/hotspots')
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

export const get_alllocations_by_userlist = (users, successCb=console.log, failCb=console.log) => {
  return (dispatch, getState) => {
    api.post('/checkins/locationsbyusers', {
      users
    })
    .then(res => {
      if(res && res.code === 200) {

        var locationmap = {};
        var alllocations = res.data;

        alllocations.forEach(checkin => {
          if(!locationmap[checkin.lid]) {
            locationmap[checkin.lid] = {
              lid: +checkin.lid,
              lat: +checkin.lat,
              lng: +checkin.lng,
              users: [],
              weight: 0,
            }
          }
          locationmap[checkin.lid].weight++;
          if(!locationmap[checkin.lid].users.includes(+checkin.uid)) {
            locationmap[checkin.lid].users.push(+checkin.uid);
          }
        })

        var locationlist = Object.keys(locationmap).map(item => locationmap[item])

        dispatch({
          type: GET_LOCATIONS_BY_USERS,
          data: locationlist.sort((x, y) => {
            return x.weight < y.weight ? 1 : -1;
          }),

        })

        successCb();
      } 
    })
  }
}


export const generate_locations = (params, successCb=console.log, failCb=console.log) => {
  return (dispatch, getState) => {
    console.warn(params);
    setTimeout(successCb, 2000);
  }
}

 

 
