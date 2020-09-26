import { getCloudApi } from './utils';

export const GET_LOGIN_INFO = 'GET_LOGIN_INFO';
export const GET_LOGIN_INFO_SUCCESS = 'GET_LOGIN_INFO_SUCCESS';

export const UPDATE_LOGIN_INFO = 'UPDATE_LOGIN_INFO';
export const UPDATE_LOGIN_INFO_SUCCESS = 'UPDATE_LOGIN_INFO_SUCCESS';

function requestAction (type, data) {
    return { type, data };
}

export function getUserInfo (params) {
    params.type = 'get';
    return dispatch => {
        getCloudApi('login', params, (data) => {
            console.log('CLOUD', data);
            return dispatch(requestAction(
                GET_LOGIN_INFO_SUCCESS,
                data
            ));
        });

        return dispatch(requestAction(GET_LOGIN_INFO));
    };
}

export function updateUserInfo (params) {
    params.type = 'update';
    return dispatch => {
        getCloudApi('login', params, (data) => {
            return dispatch(requestAction(
                UPDATE_LOGIN_INFO_SUCCESS,
                data
            ));
        });

        return dispatch(requestAction(UPDATE_LOGIN_INFO));
    };
}