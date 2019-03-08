import { GET_HEATMAP_SUCCESS, SAVE_CHECKIN_GROUPS, GET_EDGES_SUCCESS, GET_USERS_CHECKIN_TOTAL_SUCCESS,
  GET_HOTSPOTS_SUCCESS, GET_LOCATION_CHECKINS,
  GET_LOCATIONS_BY_USERS
} from 'constants/actionTypes.js';
import update from 'immutability-helper';

const INITIAL_STATE = {
  heatmapdata: [],
  locationtree: [],
  usertree: [],
  edges: [],
  hotspots: [],
  checkins: [], 
  locationlist: []


  // edges: [
  //   {
  //     source: [-74.34921704225347, 40.73014929577467, 0],
  //     target: [-73.37192913043478, 40.76445565217391, 0],
  //     value: 13
  //   }],
  // boundlocations: [],
  // boundusers: [],
}

export default function (state=INITIAL_STATE, action) {
  switch(action.type) {
    case GET_HEATMAP_SUCCESS: {
      state = update(state, {
        heatmapdata: {
          '$set': action.data
        }
      });
      break;
    }
    case SAVE_CHECKIN_GROUPS: {
      state = update(state, {
        checkins: {
          '$set': action.checkins
        },
        locationtree: {
          '$set': action.locationtree
        },
        usertree: {
          '$set': action.usertree
        }
      });
      break;
    }
    case GET_USERS_CHECKIN_TOTAL_SUCCESS: {
      var usertree = state.usertree;
      var totalcounts = action.data;

      usertree.forEach(uitem => {
        var countitem = totalcounts.find(item => +item.uid === +uitem.uid);
        uitem.total = countitem.count;
      });
      state = update(state, {
        usertree: {
          '$set': usertree
        }
      });
      break;
    }

    case GET_HOTSPOTS_SUCCESS: {
      state = update(state, {
        hotspots: {
          '$set': action.data
        }
      });
      break;
    }
    case GET_LOCATION_CHECKINS: {
      
      state = update(state, {
        checkins: {
          '$set': action.data
        }
      });
      break;
    }
    case GET_LOCATIONS_BY_USERS: {
      state = update(state, {
        locationlist: {
          '$set': action.data
        }
      });
      break;
    }
    // case GET_BOUND_USERS_SUCCESS: {
    //   state = update(state, {
    //     boundusers: {
    //       '$set': action.data
    //     }
    //   });
    //   break;
    // }
    
    default: 
      return state;
  }
  return state;
}