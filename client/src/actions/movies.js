import Taro from '@tarojs/taro';
import { getCloudApi } from './utils';

export const GET_MOVIE_LIST = 'GET_MOVIE_LIST';
export const GET_MOVIE_LIST_SUCCESS = 'GET_MOVIE_LIST_SUCCESS';

export const GET_MOVIE_INFO = 'GET_MOVIE_INFO';
export const GET_MOVIE_INFO_SUCCESS = 'GET_MOVIE_INFO_SUCCESS';

export const SEARCH_MOVIE = 'SEARCH_MOVIE';
export const SEARCH_MOVIE_SUCCESS = 'SEARCH_MOVIE_SUCCESS';

function requestAction (type, data, isMore) {
    return {
        type,
        data,
        isMore
    };
}

let pageStart = 0;
let pageLimit = 10;

function handleToast (isHide) {
    if (isHide) {
        Taro.hideToast();
        return;
    }
    Taro.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 5000
    });
}

export function getMovieList ({ tag, more }) {
    if (!more) handleToast();
    return dispatch => {
        pageStart = more ? pageStart + 10 : 0;
        getCloudApi('douban', {
            type: 'movieList',
            params: {
                tag,
                page_start: pageStart,
                page_limit: pageLimit
            }
        }, (data) => {
            if (!more) handleToast(true);
            return dispatch(requestAction(GET_MOVIE_LIST_SUCCESS, data, more));
        });

        return dispatch(requestAction(GET_MOVIE_LIST, null, more));
    };
}

export function getMovieInfo (params) {
    handleToast();
    return dispatch => {
        getCloudApi('douban', {
            type: 'movieInfo',
            params
        }, (data) => {
            handleToast(true);
            return dispatch(requestAction(GET_MOVIE_INFO_SUCCESS, data));
        });

        return dispatch(requestAction(GET_MOVIE_INFO));
    };
}

export function searchMovie (params, callback) {
    handleToast();
    return dispatch => {
        getCloudApi('douban', {
            type: 'movieSearch',
            params
        }, (data) => {
            callback && callback();
            handleToast(true);
            return dispatch(requestAction(SEARCH_MOVIE_SUCCESS, data));
        });

        return dispatch(requestAction(SEARCH_MOVIE));
    };
}