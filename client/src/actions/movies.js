export const GET_MOVIE_LIST = 'GET_MOVIE_LIST';
export const GET_MOVIE_LIST_SUCCESS = 'GET_MOVIE_LIST_SUCCESS';

export const GET_MOVIE_INFO = 'GET_MOVIE_INFO';
export const GET_MOVIE_INFO_SUCCESS = 'GET_MOVIE_INFO_SUCCESS';

import { getCloudApi } from './utils';

function doRequestList(more) {
    return {
        type: GET_MOVIE_LIST,
        isMore: more
    }
}

function doRequestListSuccess(data, more) {
    return {
        type: GET_MOVIE_LIST_SUCCESS,
        data,
        isMore: more
    }
}


function doRequestInfo() {
    return {
        type: GET_MOVIE_INFO
    }
}

function doRequestInfoSuccess(data) {
    return {
        type: GET_MOVIE_INFO_SUCCESS,
        data
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
            return dispatch(doRequestListSuccess(data, more));
        });
    
        return dispatch(doRequestList(more));
    }
};

export function getMovieInfo(params) {
    return dispatch => {
        getCloudApi('douban', {
            type: 'movieInfo',
            params
        }, (data) => {
            console.log('getMovieInfo', data);
            return dispatch(doRequestInfoSuccess(data));
        });
    
        return dispatch(doRequestInfo());
    }
};