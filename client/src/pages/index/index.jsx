import React, { Component } from 'react'
import { View, ScrollView, Input, Icon, Image } from '@tarojs/components'

import MovieList from '../../components/MovieList'

import './index.less'

const LOGO_IMG = require('./images/logo.png');

export default class Index extends Component {

  renderInput() {
    return (
      <View className="home-search">
        <View className="home-search__main">
          <Input
            className="home-search__main-input"
            placeholder="输入片名搜索"
            placeholderClass="home-search__main-placeholder"
          />
          <Icon className="home-search__main-icon" type="search" size="14" />
        </View>
        { LOGO_IMG && <Image className="home-search__logo" src="./images/logo.png" />}
      </View>
    )
  }

  renderScroll() {
    return (
      <MovieList type={0} />
    )
  }

  render() {
    return (
      <View className='index'>
        {this.renderInput()}
        {this.renderScroll()}
      </View>
    )
  }
}