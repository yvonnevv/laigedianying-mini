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
            const { data, isMore } = action;
            const { subjects, tag } = data;
            let { highscore, hot } = state.list;

            console.log('tag:', action);

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