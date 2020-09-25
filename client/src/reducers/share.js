import {
    GET_SHARE,
    GET_SHARE_SUCCESS
} from '../actions';

export function shareList (state = {
    info: {
        site1: [],
        site2: [],
        site3: []
    },
    loaded: false
}, action) {
    const { type } = action;
    let update = {};

    switch(type) {
    case GET_SHARE:
        update = { loaded: false };
        break;
    case GET_SHARE_SUCCESS:
        // const { data } = action;
        break;
    }

    return Object.keys(update).length ? Object.assign({}, state, update) : state;
}