import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Icon, Button } from '@tarojs/components';
import './index.less';

export default class Me extends Component {

    componentWillMount () {
        Taro.getSetting({
            success (res) {
                if (!res.authSetting['scope.userInfo']) {
                    console.log('UNAUTH');
                } else {
                    Taro.getUserInfo({
                        success (userinfo) {
                            console.log('res', userinfo);
                        }
                    });
                }
            }
        });
    }

    getUserInfo (e) {
        // 拿到用户信息进行下一步处理
        console.log(e.detail.userInfo);
    }

    render () {
        return (
            <View className='me'>
                <View></View>
                <Button className='btn-max-w' plain type='primary' open-type='getUserInfo' bindgetuserinfo='getUserInfo'>登录</Button>
                <View className='me-oper'>
                    <View className='me-oper__item'>
                        <View><Icon className='icon-coin'></Icon><Text>我的金币</Text></View>
                        {/* <Text>100</Text> */}
                    </View>
                    <View className='me-oper__item'>
                        <View><Icon className='icon-help'></Icon><Text>帮助</Text></View>
                    </View>
                </View>

            </View>
        );
    }
}
