import { FETCH_MOBILES_REQUEST, FETCH_MOBILES_SUCCESS, FETCH_MOBILES_FAILURE } from './mobileTypes';
import axios from 'axios';

//Contains all action creators
const fetchMobilesRequest = (mobiles) => {
    return {
        type: FETCH_MOBILES_REQUEST
    }
}

const fetchMobilesSuccess = (mobiles) => {
    return {
        type: FETCH_MOBILES_SUCCESS,
        payload: mobiles
    }
}

const fetchMobilesFailure = (error) => {
    return {
        type: FETCH_MOBILES_FAILURE,
        payload: error
    }
}

export const fetchMobiles = () => {
    return (dispatch) => {
        dispatch(fetchMobilesRequest);
        axios.get('http://localhost:3000/mobiles')
        .then((response) => {
            console.log("Fetching list of mobiles successful");
            const mobiles = response.data;
            dispatch(fetchMobilesSuccess(mobiles))
        })
        .catch((err) => {
            console.log("Unable to fetch list of mobiles");
            dispatch(fetchMobilesFailure(err));
        })
    }
}


