import React, { Component } from 'react';
import { Provider } from 'react-redux';

import Taro from '@tarojs/taro';
import { getLoginData } from './assets/utils';
import configStore from './store';
import { getCloudApi } from './actions/utils';

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
        // 是否分享进入
        const scenes = [1007, 1008, 1044];
        const { _shareId } = opts.query;
        console.log('opts', opts);
        if (scenes.includes(opts.scene) && _shareId) {
            // 判断有无该用户记录
            const userData = Taro.getStorageSync('userData');
            if (!userData) {
                // 直接调用云函数
                getCloudApi('login', {_id: _shareId, type: 'update'});
            }
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
