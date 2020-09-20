export const GET_TOKEN = 'GET_TOKEN';
export const GET_TOKEN_SUCCESS = 'GET_TOKEN_SUCCESS';

import { getCloudApi } from './utils';

function doRequest() {
    return {
        type: GET_TOKEN
    }
}

function doRequestSuccess() {
    return {
        type: GET_TOKEN_SUCCESS
    }
}

export function getToken(callback) {
    return dispatch => {
        getCloudApi('wechat', {
            type: 'wxtoken'
        }, (res) => {
            callback && callback(res);
            return dispatch(doRequestSuccess());
        });
    
        return dispatch(doRequest());
    }
};