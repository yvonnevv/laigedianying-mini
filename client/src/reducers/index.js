// src/reducers/index.js
import { combineReducers } from 'redux';
import { articles } from './articles';
import { movieList, movieInfo } from './movies';

export default combineReducers({
    articles,
    movieList,
    movieInfo
})