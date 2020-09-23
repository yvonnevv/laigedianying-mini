import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'

const LOGO_IMG = require('../../assets/images/logo.png')

export default class Search extends Component {

  componentWillMount () { }

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
        { LOGO_IMG && <Image className="home-search__logo" src="../../assets/images/logo.png" />}
      </View>
    )
  }

  render () {
    return (
      <ScrollView
        className='search'
        scrollY
        scrollWithAnimation
        // onScrollToLower={this.onScrollToLower.bind(this)}
        enableFlex={true}
      >
        {this.renderInput()}
        {this.renderScroll()}
      </ScrollView>
    )
  }
}
