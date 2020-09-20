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
    loaded: true
}, action) {
    const { type } = action;
    let update = {};
    switch (type) {
        case GET_MOVIE_LIST:
            update = { loaded: false }
            break;
        case GET_MOVIE_LIST_SUCCESS: {
            const { data } = action;
            const { subjects, tag } = data;
            let { list } = state;

            tag && (list = Object.assign({}, list, { highscore: subjects }));
            !tag && (list = Object.assign({}, list, { hot: subjects }))
            
            update = { 
                loaded: true, 
                list
            }
            break;
        }  
        default:
            break;
    }

    return Object.keys(update).length ? Object.assign({}, state, update) : state;
}