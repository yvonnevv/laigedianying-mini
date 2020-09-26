import {
    GET_SHARE,
    GET_SHARE_SUCCESS,
    CLEAR_SHARE
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
    case GET_SHARE_SUCCESS: {
        const { data } = action;
        const { site, shareLinks } = data;
        const info = Object.assign({}, state.info, {
            [`site${site}`]: shareLinks
        });
        update = { loaded: true, info };
        break;
    }
    case CLEAR_SHARE: {
        update = {
            loaded: true,
            info: {
                site1: [],
                site2: [],
                site3: []
            }
        };
        break;
    }
    default:
        break;
    }

    return Object.keys(update).length ? Object.assign({}, state, update) : state;
}