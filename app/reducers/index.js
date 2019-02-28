import { GET_HEATMAP_SUCCESS, SAVE_CHECKIN_GROUPS, GET_EDGES_SUCCESS } from 'constants/actionTypes.js';
import update from 'immutability-helper';

const INITIAL_STATE = {
  heatmapdata: [],
  checkingroups: [],
  uids: [],
  lids: [],
  edges: [],
  // edges: [
  //   {
  //     source: [-74.34921704225347, 40.73014929577467, 0],
  //     target: [-73.37192913043478, 40.76445565217391, 0],
  //     value: 13
  //   }],
  // boundlocations: [],
  // boundusers: [],
  // checkins: [], 
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
        checkingroups: {
          '$set': action.data
        },
        uids: {
          '$set': action.uids
        },
        lids: {
          '$set': action.lids
        }
      });
      break;
    }
    case GET_EDGES_SUCCESS: {
      state = update(state, {
        edges: {
          '$set': action.data
        }
      });
      break;
    }
    // case GET_BOUND_LOCATIONS_SUCCESS: {
    //   state = update(state, {
    //     boundlocations: {
    //       '$set': action.data
    //     }
    //   });
    //   break;
    // }
    // case GET_BOUND_USERS_SUCCESS: {
    //   state = update(state, {
    //     boundusers: {
    //       '$set': action.data
    //     }
    //   });
    //   break;
    // }
    // case GET_LOCATION_CHECKINS: {
    //   state = update(state, {
    //     checkins: {
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