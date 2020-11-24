import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { connect } from 'react-redux';
import { View, ScrollView, Input, Icon, Image, Text, Ad } from '@tarojs/components';
import { searchMovie } from '../../actions';
import { setShareInfo } from '../../assets/utils';
import quotes from './quote';

import MovieList from '../../components/MovieList';

import './index.less';

import LOGO_IMG from '../../assets/images/logo.png';
import SEARCH_BANNER_IMG from '../../assets/images/search-vip.png';

class Search extends Component {
    constructor () {
        super();
        this.state = {
            inputVal: '',
            isEmptyAll: true,
            quote: {}
        };
    }

    componentDidMount() {
      const quote = this.getQuote();
      this.setState({
        quote
      });
    }

    componentWillMount () {
        Taro.showShareMenu({
            withShareTicket: true
        });
    }

    onShareAppMessage () {
        const shareData = setShareInfo();
        return shareData;
    }

    getQuote () {
        const num = Math.floor(Math.random() * quotes.length);
        return quotes[num];
    }

    onSearchConfirm ({ detail }) {
        const { value: name } = detail;
        const { inputVal } = this.state;
        console.log('inputVal', inputVal);
        this.props.searchMovie(name || inputVal, () => {
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

    renderAd () {
        return (
            <Ad unit-id='adunit-871f8edb7eb2ca51'
                ad-intervals={60}
            />
        );
    }

    renderBanner() {
        return (
          <View className="search-banner">{SEARCH_BANNER_IMG && <Image src={SEARCH_BANNER_IMG} />}</View>
        )
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
                        onInput={this.onChange.bind(this)}
                    />
                    <View className="search-input__icon" onClick={this.onSearchConfirm.bind(this)}><Icon className='search-input__main-icon' type='search' size='14' /></View>
                </View>
                {LOGO_IMG && <Image className='search-input__logo' src='../../assets/images/logo.png' />}
            </View>
        );
    }

    renderEmpty () {
        const { quote } = this.state;
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
                {this.renderAd()}
                {isEmptyAll ? this.renderEmpty() : this.renderScroll()}
            </ScrollView>
        );
    }
}

Search.enableShareAppMessage = true;

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
