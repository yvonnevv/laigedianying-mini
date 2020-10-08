import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Image  } from '@tarojs/components';
import { setShareInfo } from '../../assets/utils';

import './index.less';

import HELP_IMG from './images/help.jpg';

export default class Help extends Component {
    constructor () {
        super();
    }

    componentWillMount () {
        this.statusHeight = Taro.getSystemInfoSync().statusBarHeight;

        Taro.showShareMenu({
            withShareTicket: true
        });
    }

    onShareAppMessage () {
        const shareData = setShareInfo();
        return shareData;
    }

    backToPre () {
        if (Taro.getCurrentPages().length > 1) {
            Taro.navigateBack();
        } else {
            Taro.switchTab({url: '/pages/index/index'});
        }
    }

    render () {
        return (
            <View className='help'>
                <View
                    className='help-back'
                    onClick={this.backToPre.bind(this)}
                    style={{top: this.statusHeight + 8}}
                />
                {HELP_IMG && <Image src='./images/help.jpg' />}
            </View>
        );
    }
}