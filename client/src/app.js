import React, { Component } from 'react';
import { Provider } from 'react-redux';

import Taro from '@tarojs/taro';
import { getLoginData, setScene } from './assets/utils';
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
        setScene(opts.scene);
        console.log('opts', opts);
    }

    render () {
        return (
            <Provider store={store}>
                {this.props.children}
            </Provider>
        );
    }
}
