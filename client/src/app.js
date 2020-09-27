import React, { Component } from 'react';
import { Provider } from 'react-redux';

import Taro from '@tarojs/taro';
import { getLoginData } from './assets/utils';
import configStore from './store';

import './app.less';

const store = configStore();

export default class App extends Component {

    componentWillMount () {
        if (process.env.TARO_ENV === 'weapp') {
            Taro.cloud.init();
            getLoginData(store.dispatch);
        }
    }

    render () {
        return (
            <Provider store={store}>
                {this.props.children}
            </Provider>
        );
    }
}
