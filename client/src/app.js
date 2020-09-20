import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { Provider } from 'react-redux'

import configStore from './store'
const store = configStore()

import './app.less'

class App extends Component {

  componentWillMount() {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init()
    }
  }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  render() {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App
