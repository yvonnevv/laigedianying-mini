import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, ScrollView, Input, Icon, Image } from '@tarojs/components'
import { searchMovie } from '../../actions'

import MovieList from '../../components/MovieList'

import './index.less'

const LOGO_IMG = require('../../assets/images/logo.png')

class Search extends Component {

  state = {
    inputVal: ''
  }

  componentWillMount () { }

  onSearchConfirm({ detail }) {
    const { value: name } = detail

    this.props.searchMovie(name, () => {
      this.setState({
        inputVal: ''
      })
    })
  }

  onChange({ detail }) {
    if (this.state.inputVal === detail.value) return;

    this.setState({
      inputVal: detail.value
    });
  }

  renderScroll() {
    return (
      <View className="search-list">
        <MovieList tag={2} />
      </View>
    )
  }

  renderInput() {
    return (
      <View className="search-input">
        <View className="search-input__main">
          <Input
            className="search-input__main-input"
            placeholder="输入片名搜索"
            placeholderClass="search-input__main-placeholder"
            type="search"
            value={this.state.inputVal}
            onConfirm={this.onSearchConfirm.bind(this)}
            onChange={this.onChange.bind(this)}
          />
          <Icon className="search-input__main-icon" type="search" size="14" />
        </View>
        { LOGO_IMG && <Image className="search-input__logo" src="../../assets/images/logo.png" />}
      </View>
    )
  }

  render () {
    return (
      <ScrollView
        className='search'
        scrollY
        scrollWithAnimation
        enableFlex={true}
      >
        {this.renderInput()}
        {this.renderScroll()}
      </ScrollView>
    )
  }
}

export default connect(
  () => {},
  dispatch => {
    return {
      searchMovie(name, callback) {
        return dispatch(searchMovie({ name }, callback))
      }
    }
  }
)(Search)
