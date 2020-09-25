// src/reducers/index.js
import { combineReducers } from 'redux';
import { articles } from './articles';
import { movieList, movieInfo } from './movies';
import { shareList } from './share';

export default combineReducers({
    articles,
    movieList,
    movieInfo,
    shareList
});