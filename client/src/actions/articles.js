import { getCloudApi } from './utils';

export const GET_ARTICLE = 'GET_ARTICLE';
export const GET_ARTICLE_SUCCESS = 'GET_ARTICLE_SUCCESS';

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
        getCloudApi('wechat', {
            type: 'articles',
            params
        }, ({ item = [] }) => {
            return dispatch(doRequestSuccess(item));
        });

        return dispatch(doRequest());
    };
}