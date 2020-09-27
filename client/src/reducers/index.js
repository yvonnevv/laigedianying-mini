// src/reducers/index.js
import { combineReducers } from 'redux';
import { articles } from './articles';
import { movieList, movieInfo } from './movies';
import { shareList } from './share';
import { userInfo } from './login';

const rootReducers = combineReducers({
    userInfo,
    articles,
    movieList,
    movieInfo,
    shareList
});

export default rootReducers;