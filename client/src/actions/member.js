import Taro from '@tarojs/taro';
import { getCloudApi } from './utils';

export const GET_USER_INFO = 'GET_USER_INFO';
export const GET_USER_INFO_SUCCESS = 'GET_USER_INFO_SUCCESS';

export const UPDATE_USER_INFO = 'UPDATE_USER_INFO';
export const UPDATE_USER_INFO_SUCCESS = 'UPDATE_USER_INFO_SUCCESS';

function handleLoading (isHide) {
    if (isHide) {
        Taro.hideLoading();
        return;
    }
    Taro.showLoading({
        title: '加载中'
    });
}

function requestAction (type, data) {
    return { type, data };
}

export function getUserInfo (params, callback) {
    params.type = 'search';
    handleLoading();
    return dispatch => {
        getCloudApi('login', params, (data) => {
            callback && callback(data);
            handleLoading(true);
            return dispatch(requestAction(
                GET_USER_INFO_SUCCESS,
                data
            ));
        });

        return dispatch(requestAction(GET_USER_INFO));
    };
}

export function updateUserInfo (params, callback) {
    params.type = 'setVip';
    return dispatch => {
        getCloudApi('login', params, (data) => {
            callback && callback(data);
            return dispatch(requestAction(
                UPDATE_USER_INFO_SUCCESS,
                data
            ));
        });

        return dispatch(requestAction(UPDATE_USER_INFO));
    };
}