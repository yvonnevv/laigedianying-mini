import { getCloudApi } from './utils';

export const GET_SHARE = 'GET_SHARE';
export const GET_SHARE_SUCCESS = 'GET_SHARE_SUCCESS';
export const CLEAR_SHARE = 'CLEAR_SHARE';

function requestAction (type, data) {
    return {
        type,
        data
    };
}

export function getShareInfo (params) {
    return dispatch => {
        getCloudApi('source', params, (data) => {
            return dispatch(requestAction(
                GET_SHARE_SUCCESS,
                Object.assign(data, { site: params.site }))
            );
        });

        return dispatch(requestAction(GET_SHARE));
    };
}

export function clearLastShareList () {
    return dispatch => {
        return dispatch(requestAction(CLEAR_SHARE));
    };
}