import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Taro from '@tarojs/taro';

import configStore from './store';

import './app.less';

const store = configStore();

class App extends Component {

    componentWillMount () {
        if (process.env.TARO_ENV === 'weapp') {
            Taro.cloud.init();
        }
    }

    componentDidShow () { }

    componentDidHide () { }

    componentDidCatchError () { }

    render () {
        return (
            <Provider store={store}>
                {this.props.children}
            </Provider>
        );
    }
}

export default App;
