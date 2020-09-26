// src/reducers/index.js
import { combineReducers } from 'redux';
import { articles } from './articles';
import { movieList, movieInfo } from './movies';
import { shareList } from './share';
import { userInfo } from './login';

export default combineReducers({
    articles,
    movieList,
    movieInfo,
    shareList,
    userInfo
});