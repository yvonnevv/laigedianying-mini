import React, { Component } from 'react';
import { connect } from 'react-redux';
import Taro from '@tarojs/taro';
import { AtModal, AtModalContent, AtModalAction } from 'taro-ui';
import { View, Text, Icon, Button, Image } from '@tarojs/components';
import {
    getLoginData, setUserInfo,
    setShareInfo, createRewardedVideoAd,
    updateCoin
} from '../../assets/utils';

import VIP_ICON from '../../assets/images/vip.png';
import NORMAL_ICON from '../../assets/images/vip2.png';

import 'taro-ui/dist/style/components/modal.scss';
import './index.less';

class Me extends Component {
    constructor () {
        super();
        this.videoAd = null;
        this.state = {isOpened: false};
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

    showConfirm() {
        const __self = this;
        Taro.showModal({
            content: '请选择金币领取的方式哦～',
            confirmText: '永久VIP',
            cancelText: '广告获取',
            success (res) {
                if (res.confirm) {
                    __self.setModalVisible(true);
                } else {
                    __self.showVideo();
                }
            }
        });
    }

    setModalVisible (show) {
        this.setState({ isOpened: show });
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

    copyContent(type) {
        const data = type 
            ? '1👈fu置该句€X3AdcjX3j1c€回👉闲鱼或手机淘tao宝👈或点几连结 https://m.tb.cn/h.4XdA6si 至流览器【我在闲鱼发布了【来个电影会员VIP专拍】】'
            : 'Checky123';

        Taro.setClipboardData({ data });
    }
 
    renderContent() {
        return (
            <View className="me-charge">
                <View className="me-charge__tit"><Text>¥9.9充值VIP永久免费获取汁源</Text></View>
                <View className="me-charge__way">
                    <View>方法1：添加管理员微信 Checky123 购买<Button size="mini" onClick={this.copyContent.bind(this, 0)}>复制微信</Button></View>
                </View>
                <View className="me-charge__way">
                    <View>方法2：闲鱼担保购买<Button size="mini" onClick={this.copyContent.bind(this, 1)}>复制到闲鱼打开</Button></View>
                </View>
            </View>
        )
    }

    render () {
        const isLogin = this.isLogin();
        const { userData } = this.props;
        const { isOpened } = this.state;

        return (
            <View className='me'>
                <AtModal isOpened={isOpened} closeOnClickOverlay>
                    <AtModalContent className='detail-login__ctn'>{this.renderContent()}</AtModalContent>
                    <AtModalAction>
                        <Button className='detail-login__btn' onClick={this.setModalVisible.bind(this, false)}>关闭</Button>
                    </AtModalAction>
                </AtModal>
                <View className='me-avatar'>
                    { isLogin
                        ? <Image src={userData.avatar} />
                        : <View class='me-avatar__default'>来</View>
                    }
                </View>
                <View className='me-nick'>
                    <View className="me-vip">
                      { VIP_ICON && userData.isVip && <Image src={VIP_ICON}/> }
                      { NORMAL_ICON && !userData.isVip && <Image src={NORMAL_ICON}/> }
                    </View>
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
                            { userData.open && <Button className='me-oper__item' onClick={this.showConfirm.bind(this)} type='primary'>获取金币</Button>}
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