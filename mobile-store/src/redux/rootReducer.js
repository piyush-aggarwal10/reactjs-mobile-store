import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import mobileReducer from './mobile/mobileReducer';
import cartReducer from './cart/cartReducer';

const rootReducer = combineReducers({
    mobile: mobileReducer,
    cart: cartReducer
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['mobile', 'cart'],
    // blacklist: ['cart']
}

export default persistReducer(persistConfig, rootReducer);
