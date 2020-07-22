import { createStore, applyMiddleware } from 'redux';
import rootReducer from './rootReducer';
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist';

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(logger, thunk)));
 
const persistor = persistStore(store);

export { store, persistor };