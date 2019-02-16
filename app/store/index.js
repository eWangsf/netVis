import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducers from 'reducers';

const createAppStore = applyMiddleware(thunk)(createStore);

export default function configureStore() {
    const store = createAppStore(reducers);
    
    return store
}
