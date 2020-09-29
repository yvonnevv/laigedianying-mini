import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ScrollView, Input, Icon, Image, Text } from '@tarojs/components';
import { searchMovie } from '../../actions';
import { setShareInfo } from '../../assets/utils';
import quotes from './quote';

import MovieList from '../../components/MovieList';

import './index.less';

import LOGO_IMG from '../../assets/images/logo.png';

class Search extends Component {
    constructor () {
        super();
        this.state = {
            inputVal: '',
            isEmptyAll: true
        };
    }

    getQuote () {
        const num = Math.floor(Math.random() * quotes.length);
        return quotes[num];
    }

    onSearchConfirm ({ detail }) {
        const { value: name } = detail;

        this.props.searchMovie(name, () => {
            this.setState({
                inputVal: '',
                isEmptyAll: false
            });
        });
    }

    onChange ({ detail }) {
        if (this.state.inputVal === detail.value) return;
        if (!detail.value) {
            this.setState({
                isEmptyAll: true
            });
        }
        this.setState({
            inputVal: detail.value
        });
    }

    renderScroll () {
        return (
            <View className='search-list'>
                <MovieList tag={2} />
            </View>
        );
    }

    renderInput () {
        return (
            <View className='search-input'>
                <View className='search-input__main'>
                    <Input
                        className='search-input__main-input'
                        placeholder='输入片名搜索'
                        placeholderClass='search-input__main-placeholder'
                        type='search'
                        value={this.state.inputVal}
                        onConfirm={this.onSearchConfirm.bind(this)}
                        onChange={this.onChange.bind(this)}
                    />
                    <Icon className='search-input__main-icon' type='search' size='14' />
                </View>
                {LOGO_IMG && <Image className='search-input__logo' src='../../assets/images/logo.png' />}
            </View>
        );
    }

    renderEmpty () {
        const quote = this.getQuote();
        return (
            <View className='search-quote'>
                <View className='search-quote__icon first'></View>
                <View className='search-quote__text'>
                    <View className='content'>{quote.content}</View>
                    <View className='from'><Text>《{quote.from}》</Text></View>
                </View>
                <View className='search-quote__icon last'></View>
            </View>
        );
    }

    render () {
        const { isEmptyAll } = this.state;
        return (
            <ScrollView className='search' scrollY scrollWithAnimation enableFlex>
                {this.renderInput()}
                {isEmptyAll ? this.renderEmpty() : this.renderScroll()}
            </ScrollView>
        );
    }
}

export default connect(
    ({ movieList }) => movieList,
    (dispatch) => {
        return {
            searchMovie (name, callback) {
                return dispatch(searchMovie({ name }, callback));
            }
        };
    }
)(Search);
