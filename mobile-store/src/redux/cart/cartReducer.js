import { UPDATE_CART } from './cartTypes';

const initialState = {
    cart: [
        {
            "cartId": 1,
            "userId": 1,
            "cartTotal": 0,
            "mobilesQtyMapper": [
            // {
            //     "mobileId": 1,
            //     "quantity": 4
            // }
        ]
        },
        {
            "cartId": 2,
            "userId": 2,
            "cartTotal": 0,
            "mobilesQtyMapper": []
        }
    ]
}

const cartReducer = (state = initialState, action) => {
    switch(action.type) {
        case UPDATE_CART: return {
            ...state,
            cart: action.payload
        }
        default: return state
    }
    
}

export default cartReducer;