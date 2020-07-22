import { FETCH_MOBILES_REQUEST, FETCH_MOBILES_SUCCESS, FETCH_MOBILES_FAILURE } from './mobileTypes';

const initialState = {
    loading: false,
    mobiles: [],
    error: ''
}

const mobileReducer = (state = initialState, action) => {
    switch(action.type) {
        case FETCH_MOBILES_REQUEST: return {
            ...state,
            loading: true
        }
        case FETCH_MOBILES_SUCCESS: return {
            loading: false,
            mobiles: action.payload,
            error: ''
        }
        case FETCH_MOBILES_FAILURE: return {
            loading: false,
            mobiles: [],
            error: action.payload
        }
        default: return state

    }
}

export default mobileReducer;