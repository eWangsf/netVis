import { GET_BOUND_LOCATIONS_SUCCESS, GET_BOUND_USERS_SUCCESS, GET_LOCATION_CHECKINS } from 'constants/actionTypes.js';
import update from 'immutability-helper';

const INITIAL_STATE = {
  boundlocations: [],
  boundusers: [],
  checkins: [], 
}

export default function (state=INITIAL_STATE, action) {
  switch(action.type) {
    case GET_BOUND_LOCATIONS_SUCCESS: {
      state = update(state, {
        boundlocations: {
          '$set': action.data
        }
      });
      break;
    }
    case GET_BOUND_USERS_SUCCESS: {
      state = update(state, {
        boundusers: {
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
    default: 
      return state;
  }
  return state;
}