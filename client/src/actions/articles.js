import Taro from '@tarojs/taro';
import { getCloudApi } from './utils';

export const GET_ARTICLE = 'GET_ARTICLE';
export const GET_ARTICLE_SUCCESS = 'GET_ARTICLE_SUCCESS';

function handleToast (isHide) {
    if (isHide) {
        Taro.hideToast();
        return;
    }
    Taro.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 3000
    });
}

function doRequest () {
    return {
        type: GET_ARTICLE
    };
}

function doRequestSuccess (data) {
    return {
        type: GET_ARTICLE_SUCCESS,
        data
    };
}

export function getArticles (params) {
    return dispatch => {
        handleToast();
        getCloudApi('wechat', params, ({ item = [] }) => {
            handleToast(true);
            return dispatch(doRequestSuccess(item));
        });

        return dispatch(doRequest());
    };
}