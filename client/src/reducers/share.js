import {
    GET_SHARE,
    GET_SHARE_SUCCESS,
    CLEAR_SHARE,
    UPDATE_GOTTEN_SHARE
} from '../actions';

export function shareList (state = {
    info: {
        site1: [],
        site2: [],
        site3: []
    },
    got: [],
    open: true,
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
        const { site, shareLinks, open } = data;
        const info = Object.assign({}, state.info, {
            [`site${site}`]: shareLinks
        });
        update = { loaded: true, info, open };
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
    case UPDATE_GOTTEN_SHARE: {
        const { data } = action;
        const gotten = [...state.got];
        gotten.push(data);
        update = {
            got: gotten
        };
        break;
    }
    default:
        break;
    }

    return Object.keys(update).length ? Object.assign({}, state, update) : state;
}