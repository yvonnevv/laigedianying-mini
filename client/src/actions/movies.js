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

function handleLoading (isHide) {
    if (isHide) {
        Taro.hideLoading();
        return;
    }
    Taro.showLoading({
        title: '加载中'
    });
}

export function getMovieList ({ tag, more }) {
    if (!more) handleLoading();
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
            if (!more) handleLoading(true);
            return dispatch(requestAction(GET_MOVIE_LIST_SUCCESS, data, more));
        });

        return dispatch(requestAction(GET_MOVIE_LIST, null, more));
    };
}

export function getMovieInfo (params) {
    handleLoading();
    return dispatch => {
        getCloudApi('douban', {
            type: 'movieInfo',
            params
        }, (data) => {
            handleLoading(true);
            return dispatch(requestAction(GET_MOVIE_INFO_SUCCESS, data));
        }, () => {
          handleLoading(true);
          Taro.showToast({
            icon: 'none',
            title: '暂未搜索到'
          });
          setTimeout(() => {
            Taro.navigateBack();
          }, 1200);
        });

        return dispatch(requestAction(GET_MOVIE_INFO));
    };
}

export function searchMovie (params, callback) {
    handleLoading();
    return dispatch => {
        getCloudApi('douban', {
            type: 'movieSearch',
            params
        }, (data) => {
            callback && callback();
            handleLoading(true);
            return dispatch(requestAction(SEARCH_MOVIE_SUCCESS, data));
        });

        return dispatch(requestAction(SEARCH_MOVIE));
    };
}