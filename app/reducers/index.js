import { GET_BOUND_LOCATIONS_SUCCESS } from 'constants/actionTypes.js';
import update from 'immutability-helper';

const INITIAL_STATE = {
  boundlocations: [],
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
    default: 
      return state;
  }
  return state;
}