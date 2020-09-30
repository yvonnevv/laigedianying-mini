import React, { Component } from 'react';
import { Provider } from 'react-redux';

import Taro from '@tarojs/taro';
import { getLoginData, setEnterInfo } from './assets/utils';
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

    componentDidShow (opts) {
        const { scene, query } = opts;
        const { shareId } = query;
        if (shareId) {
            console.log('点别人分享的链接进来的', shareId);
        }
        setEnterInfo(scene, shareId);
    }

    render () {
        return (
            <Provider store={store}>
                {this.props.children}
            </Provider>
        );
    }
}
