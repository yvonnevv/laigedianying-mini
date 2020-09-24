import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Icon, Button, Image } from '@tarojs/components';

import './index.less';

export default class Me extends Component {
    constructor () {
        super();
        this.state = {
            nick: '',
            avatar: '',
            isLogin: false
        };
    }

    componentWillMount () {
        this.getLoginData();
    }

    setUserInfo (userinfo) {
        if (userinfo.errMsg === 'getUserInfo:ok') {
            const rawData = JSON.parse(userinfo.rawData);
            this.setState({
                nick: rawData.nickName,
                avatar: rawData.avatarUrl,
                isLogin: true
            });
        }
    }

    getLoginData () {
        const __self = this;

        Taro.getSetting({
            success (res) {
                if (res.authSetting['scope.userInfo']) {
                    Taro.getUserInfo({
                        success (userinfo) {
                            __self.setUserInfo(userinfo);
                        }
                    });
                }
            }
        });
    }

    getUserInfo ({ detail }) {
        // 拿到用户信息进行下一步处理
        this.setUserInfo(detail);
    }

    render () {
        const { isLogin, avatar, nick } = this.state;
        return (
            <View className='me'>
                <View className='me-avatar'>
                    { isLogin
                        ? <Image src={avatar} />
                        : <View class='me-avatar__default'>来</View>
                    }
                </View>
                <View className='me-nick'>
                    <Text>{isLogin ? nick : '登录获取更多精彩～'}</Text>
                </View>
                {
                    isLogin ? (
                        <View className='me-oper'>
                            <View className='me-oper__item'>
                                <View><Icon className='icon-coin'></Icon><Text>我的金币</Text></View>
                                <View className='right'><Text className='icon-arrow'>100</Text></View>
                            </View>
                            <View className='me-oper__item'>
                                <View><Icon className='icon-help'></Icon><Text>帮助</Text></View>
                                <View className='right'><Icon className='icon-more'></Icon></View>
                            </View>
                        </View>
                    ) : (
                        <View className='me-oper'>
                            <Button
                                type='primary'
                                openType='getUserInfo'
                                onGetUserInfo={this.getUserInfo.bind(this)}
                            >
                                登 录
                            </Button>
                        </View>
                    )
                }
            </View>
        );
    }
}
