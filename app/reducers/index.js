import { RECEIVE_EDGE_SUCCESS } from 'constants/actionTypes.js';
import update from 'immutability-helper';

const INITIAL_STATE = {
  nodecheckincountmap: {},
  edges: []
}

export default function (state=INITIAL_STATE, action) {
  switch(action.type) {
    case RECEIVE_EDGE_SUCCESS: {
      var record = action.data;
      var nodecheckincountmap = state.nodecheckincountmap;
      if(!nodecheckincountmap[record.src]) {
        nodecheckincountmap[record.src] = 0;
      }
      nodecheckincountmap[record.src]++;

      state = update(state, {
        edges: {
          '$push': [record]
        },
        nodecheckincountmap: {
          '$set': nodecheckincountmap
        }
      });
      break;
    }
    default: 
      return state;
  }
  return state;
}