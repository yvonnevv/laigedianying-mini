import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { connect } from 'react-redux'
import { View, Input, Text, Icon, Image, ScrollView } from '@tarojs/components'
import { getMovieList } from '../../actions'

import MovieList from '../../components/MovieList'

import './index.less'

const LOGO_IMG = require('../../assets/images/logo.png')

class Index extends Component {

  state = {
    activeIdx: 1
  }

  componentWillMount() {
    Taro.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 4000
    })
    this.fetchData();
  }

  switchMovieTab(idx) {
    if (this.activeIdx === idx) return;
    this.setState({
      activeIdx: idx
    })
    this.fetchData({ tag: idx })
  }

  toSearchPage() {
    Taro.navigateTo({
      url: '/pages/search/index'
    })
  }

  onScrollToLower() {
    if (!this.props.movieList.loaded) return;
    this.fetchData({ more: true });
  }

  fetchData(params) {
    const { activeIdx: tag } = this.state;
    const { list } = this.props.movieList;
    const mapList = tag ? list.highscore : list.hot
    const { more } = params || {};
    if (!more && mapList.length) return;
    this.props.fetchMovieList(Object.assign({}, { tag }, params));
  }

  renderInput() {
    return (
      <View className="home-search">
        <View className="home-search__main">
          <Input
            className="home-search__main-input"
            placeholder="输入片名搜索"
            placeholderClass="home-search__main-placeholder"
            onClick={this.toSearchPage}
          />
          <Icon className="home-search__main-icon" type="search" size="14" />
        </View>
        { LOGO_IMG && <Image className="home-search__logo" src="../../assets/images/logo.png" />}
      </View>
    )
  }

  renderScroll() {
    const { activeIdx } = this.state;

    return (
      <View className="home-main">
        <View className="home-tab">
          <View
            onClick={this.switchMovieTab.bind(this, 0)}
            className={`home-tab__item ${!activeIdx ? 'active' : ''}`}
          >
            <Text className="home-tab__text">最新推荐</Text>
          </View>
          <View
            onClick={this.switchMovieTab.bind(this, 1)}
            className={`home-tab__item ${activeIdx ? 'active' : ''}`}
          >
            <Text className="home-tab__text">热门电影</Text>
          </View>
        </View>
        <MovieList tag={activeIdx} />
      </View>
    )
  }

  render() {
    return (
      <ScrollView
        className='home'
        scrollY
        scrollWithAnimation
        lowerThreshold={200}
        onScrollToLower={this.onScrollToLower.bind(this)}
        enableFlex={true}
      >
        {this.renderInput()}
        {this.renderScroll()}
      </ScrollView>
    )
  }
}

export default connect(
  ({ movieList }) => { return { movieList } },
  dispatch => {
      return {
          fetchMovieList(params) {
              return dispatch(getMovieList(params));
          }
      }
  }
)(Index);