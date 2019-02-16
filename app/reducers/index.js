import { LOAD_DATASOURCE_SUCCESS } from 'constants/actionTypes.js';
import update from 'immutability-helper';

const INITIAL_STATE = {
  nodes: {},
  edges: {}
}

export default function (state=INITIAL_STATE, action) {
  switch(action.type) {
    case LOAD_DATASOURCE_SUCCESS: {
      state = update(state, {
        nodes: {
          '$set': action.nodes
        },
        edges: {
          '$set': action.edges
        },
      });
      break;
    }
    default: 
      return state;
  }
  return state;
}