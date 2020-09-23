export const GET_MOVIE_LIST = 'GET_MOVIE_LIST';
export const GET_MOVIE_LIST_SUCCESS = 'GET_MOVIE_LIST_SUCCESS';

export const GET_MOVIE_INFO = 'GET_MOVIE_INFO';
export const GET_MOVIE_INFO_SUCCESS = 'GET_MOVIE_INFO_SUCCESS';

export const SEARCH_MOVIE = 'SEARCH_MOVIE';
export const SEARCH_MOVIE_SUCCESS = 'SEARCH_MOVIE_SUCCESS';

import { getCloudApi } from './utils';

function requestAction(type, data, isMore) {
    return {
        type,
        data,
        isMore
    }
}

let pageStart = 0;
let pageLimit = 10;

export function getMovieList({ tag, more }) {
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
            return dispatch(requestAction(GET_MOVIE_LIST_SUCCESS, data, more));
        });

        return dispatch(requestAction(GET_MOVIE_LIST, null, more));
    }
};

export function getMovieInfo(params) {
    return dispatch => {
        getCloudApi('douban', {
            type: 'movieInfo',
            params
        }, (data) => {
            return dispatch(requestAction(GET_MOVIE_INFO_SUCCESS, data))
        });

        return dispatch(requestAction(GET_MOVIE_INFO))
    }
};

export function searchMovie(params, callback) {
    return dispatch => {
        getCloudApi('douban', {
            type: 'movieSearch',
            params
        }, (data) => {
            callback && callback()
            return dispatch(requestAction(SEARCH_MOVIE_SUCCESS, data))
        });

        return dispatch(requestAction(SEARCH_MOVIE));
    }
}