export const GET_MOVIE_LIST = 'GET_MOVIE_LIST';
export const GET_MOVIE_LIST_SUCCESS = 'GET_MOVIE_LIST_SUCCESS';

export const GET_MOVIE_INFO = 'GET_MOVIE_INFO';
export const GET_MOVIE_SUCCESS = 'GET_MOVIE_SUCCESS';

import { getCloudApi } from './utils';

function doRequestList() {
    return {
        type: GET_MOVIE_LIST
    }
}

function doRequestListSuccess(data) {
    return {
        type: GET_MOVIE_LIST_SUCCESS,
        data
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

export function getMovieList(params) {
    return dispatch => {
        getCloudApi('douban', {
            type: 'movieList',
            params
        }, (data) => {
            return dispatch(doRequestListSuccess(data));
        });
    
        return dispatch(doRequestList());
    }
};

export function getMovieInfo(params) {
    return dispatch => {
        getCloudApi('douban', {
            type: 'movieInfo',
            params
        }, ({ summary }) => {
            return dispatch(doRequestInfoSuccess(summary));
        });
    
        return dispatch(doRequestInfo());
    }
};