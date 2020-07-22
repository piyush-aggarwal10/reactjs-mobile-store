import { UPDATE_CART } from './cartTypes';

// Contains all action creators
export const updateCart = (updatedCart) => {

    return {
        type: UPDATE_CART,
        payload: updatedCart
    }
}



