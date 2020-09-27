import { getCloudApi } from './utils';

export const GET_LOGIN_INFO = 'GET_LOGIN_INFO';
export const GET_LOGIN_INFO_SUCCESS = 'GET_LOGIN_INFO_SUCCESS';

export const UPDATE_LOGIN_INFO = 'UPDATE_LOGIN_INFO';
export const UPDATE_LOGIN_INFO_SUCCESS = 'UPDATE_LOGIN_INFO_SUCCESS';

export const SET_DEFAULT_LOGIN_INFO = 'SET_DEFAULT_LOGIN_INFO';

function requestAction (type, data) {
    return { type, data };
}

export function setDefaultUserInfo (params) {
    return dispatch => {
        return dispatch(requestAction(SET_DEFAULT_LOGIN_INFO, params));
    };
}

export function getUserInfo (params, callback) {
    params.type = 'get';
    return dispatch => {
        getCloudApi('login', params, (data) => {
            callback && callback(data);
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