import React, { Component } from 'react';
import { connect } from 'react-redux';
import Taro from '@tarojs/taro';
import { View, Text, Icon, Button, Image } from '@tarojs/components';
import {
    getLoginData, setUserInfo,
    setShareInfo, createRewardedVideoAd,
    updateCoin
} from '../../assets/utils';

import './index.less';

class Me extends Component {
    constructor () {
        super();
        this.videoAd = null;
    }

    componentWillMount () {
        Taro.showShareMenu({
            withShareTicket: true
        });

        this.videoAd = createRewardedVideoAd(() => {
            const { userData } = this.props;
            const { _id, coin, isVip, nick, avatar } = userData;
            updateCoin(
                {_id, coin: coin + 10, nick, avatar, isVip },
                this.props.dispatch
            );
        });

        console.log('this.videoAd', this.videoAd);
    }

    showVideo () {
        // console.log('videoAd', this.videoAd);
        this.videoAd.show()
            .catch(() => {
                this.videoAd.load()
                    .then(() => this.videoAd.show())
                    .catch(err => {
                        Taro.showToast({
                            title: `视频拉取失败: ${err}`,
                            icon: 'none'
                        });
                    });
            });
    }

    isLogin () {
        const { userData } = this.props;
        return !!Object.keys(userData).length;
    }

    onShareAppMessage () {
        const shareData = setShareInfo();
        return shareData;
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

    onPullDownRefresh () {
        getLoginData(this.props.dispatch);
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
                            <Button className='me-oper__item' onClick={this.showVideo.bind(this)} type='primary'>获取金币</Button>
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

Me.enableShareAppMessage = true;

export default connect(
    ({ userInfo }) => { return { userData: userInfo.info }; }
)(Me);