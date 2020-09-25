import { getCloudApi } from './utils';

export const GET_SHARE = 'GET_SHARE';
export const GET_SHARE_SUCCESS = 'GET_SHARE_SUCCESS';

function requestAction (type, data) {
    return {
        type,
        data
    };
}

export function getShareInfo (params) {
    return dispatch => {
        getCloudApi('source', params, (data) => {
            return dispatch(requestAction(GET_SHARE_SUCCESS, data));
        });

        return dispatch(requestAction(GET_SHARE));
    };
}