import React, { Component } from 'react';
import { View } from '@tarojs/components';
import './index.less';

import Login from '../../components/login/index';

export default class Index extends Component {

    componentWillMount () { }

    componentDidMount () { }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    render () {
        return (
            <View className='index'>
                <Login />
            </View>
        );
    }
}
