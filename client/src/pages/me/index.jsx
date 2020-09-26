import React, { Component } from 'react';
import { connect } from 'react-redux';
import Taro from '@tarojs/taro';
import { View, Text, Icon, Button, Image } from '@tarojs/components';

import { getUserInfo } from '../../actions';

import './index.less';

class Me extends Component {
    constructor () {
        super();
        this.state = {
            nick: '',
            avatar: '',
            isLogin: false
        };
    }

    componentWillMount () {
        Taro.showToast({
            title: '登录中',
            icon: 'loading',
            duration: 1500
        });

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
            // 拉一下金币
            this.props.fetchUserInfo({
                nick: rawData.nickName, avatar: rawData.avatarUrl
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
        // console.log('userInfo', this.props.userInfo);
        const { coin } = this.props;

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
                                <View className='right'><Text className='icon-arrow'>{coin}</Text></View>
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

export default connect(
    ({ userInfo }) => {
        return { coin: userInfo.info.coin };
    },
    dispatch => {
        return {
            fetchUserInfo (params) {
                return dispatch(getUserInfo(params));
            }
        };
    }
)(Me);