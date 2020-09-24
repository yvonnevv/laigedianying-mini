import React, { Component } from 'react';
import { Current } from '@tarojs/taro';
import { WebView } from '@tarojs/components';

export default class AppWebView extends Component {
    render () {
        const { params } = Current.router;
        const { url } = params;
        return (
            <WebView src={decodeURIComponent(url)} />
        );
    }
}