import React, { Component } from 'react';
import { connect } from 'react-redux';
import Taro from '@tarojs/taro';
import { View, Text, Icon, Button, Image } from '@tarojs/components';
import { setUserInfo } from '../../assets/utils';

import './index.less';

class Me extends Component {
    constructor () {
        super();
    }

    isLogin () {
        const { userData } = this.props;
        return !!Object.keys(userData).length;
    }

    getUserInfo ({ detail }) {
        // 拿到用户信息进行下一步处理
        setUserInfo(detail, this.props.dispatch);
    }

    toHelpPage () {
        Taro.navigateTo({
            url: '../help/index'
        });
    }

    render () {
        const isLogin = this.isLogin();
        const { userData } = this.props;

        return (
            <View className='me'>
                <View className='me-avatar'>
                    { isLogin
                        ? <Image src={userData.avatar} />
                        : <View class='me-avatar__default'>来</View>
                    }
                </View>
                <View className='me-nick'>
                    <Text>{isLogin ? userData.nick : '登录获取更多精彩～'}</Text>
                </View>
                {
                    isLogin ? (
                        <View className='me-oper'>
                            <View className='me-oper__item'>
                                <View><Icon className='icon-coin'></Icon><Text>我的金币</Text></View>
                                <View className='right'><Text className='icon-arrow'>{userData.coin}</Text></View>
                            </View>
                            <View className='me-oper__item' onClick={this.toHelpPage}>
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
    ({ userInfo }) => { return { userData: userInfo.info }; }
)(Me);