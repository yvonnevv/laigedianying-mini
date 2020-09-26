import {
    GET_LOGIN_INFO,
    GET_LOGIN_INFO_SUCCESS,
    UPDATE_LOGIN_INFO,
    // UPDATE_LOGIN_INFO_SUCCESS,
} from '../actions';

export function userInfo (state = {
    loaded: true,
    info: {}
}, action) {
    const { type } = action;
    let update = {};
    switch(type) {

    case GET_LOGIN_INFO:
    case UPDATE_LOGIN_INFO:
        update = { loaded: false };
        break;

    case GET_LOGIN_INFO_SUCCESS: {
        const { data } = action;
        update = { loaded: true, info: data };
        break;
    }

    default:
        break;
    }

    return Object.keys(update).length ? Object.assign({}, state, update) : state;
}