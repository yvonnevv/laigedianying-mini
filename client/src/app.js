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

            Taro.showShareMenu({
                withShareTicket: true
            });
        }
    }

    componentDidShow (ops) {
        console.log('APP-每次启动', ops);
        // if (ops.shareTicket) {
        //     Taro.getShareInfo({
        //         shareTicket: ops.shareTicket,
        //         success (res) {
        //             console.log(res);
        //         // { errMsg: "getShareInfo:ok", iv: "OJX/PX3nna0HHVID9zw==", encryptedData: "Vtnj6nlqduHBWFJKYSyKh4yHDMPuU1Hs7l6iPQCNMZ6U4qCstX…vk2HiraBektRNdOkxHi0FgGVkgSxwQxWz2LQrw==" }
        //         }
        //     });
        // }
    }

    render () {
        return (
            <Provider store={store}>
                {this.props.children}
            </Provider>
        );
    }
}
