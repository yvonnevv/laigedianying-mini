import {
    GET_MOVIE_LIST,
    GET_MOVIE_INFO,
    GET_MOVIE_LIST_SUCCESS,
    GET_MOVIE_INFO_SUCCESS
} from '../actions';

export function movieList(state = {
    list: {
        hot: [],
        highscore: []
    },
    loaded: false
}, action) {
    const { type } = action;
    let update = {};
    switch (type) {
        case GET_MOVIE_LIST:
            update = { loaded: false };
            break;
        case GET_MOVIE_LIST_SUCCESS: {
            const { data, isMore } = action;
            const { subjects, tag } = data;
            let { highscore, hot } = state.list;
            tag && (isMore ? highscore.push(...subjects) : highscore = subjects);
            !tag && (isMore ? hot.push(...subjects) : hot = subjects);

            update = { 
                loaded: true, 
                list: {
                    highscore,
                    hot
                }
            }
            break;
        }  
        default:
            break;
    }

    return Object.keys(update).length ? Object.assign({}, state, update) : state;
}

export function movieInfo(state = {
  info: {},
  loaded: false
}, action) {
    const { type } = action;
    let update = {};

    switch(type) {
        case GET_MOVIE_INFO:
            update = { loaded: false };
            break;
        case GET_MOVIE_INFO_SUCCESS:
            const { data } = action;
            update = { loaded: true, info: data };
            break;
        default:
            break;
    }

    return Object.keys(update).length ? Object.assign({}, state, update) : state;
}