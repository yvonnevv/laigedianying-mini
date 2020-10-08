import React, { Component } from 'react';
import { AtModal, AtModalContent, AtModalAction } from 'taro-ui';
import { connect } from 'react-redux';
import Taro, { Current } from '@tarojs/taro';
import { View, Text, Image, Button, Ad } from '@tarojs/components';

import 'taro-ui/dist/style/components/modal.scss';
import './index.less';

import { getMovieInfo, getShareInfo, clearLastShareList, updateGotten } from '../../actions';
import { setShareInfo, setUserInfo, updateCoin, createRewardedVideoAd } from '../../assets/utils';

class Detail extends Component {
    constructor () {
        super();
        this.statusHeight = 0;
        this.videoAd = null;
        this.state = {
            siteIdx: 0,
            isOpened: false
        };
    }

    componentWillMount () {
        const { params } = Current.router;
        const { id, title: kw } = params;
        const { siteIdx } = this.state;

        this.movieId = id;
        this.kw = decodeURIComponent(kw);
        this.kw = decodeURIComponent(this.kw).split(' ')[0];
        this.title = this.kw;
        this.kw = this.kw.substring(0, this.kw.length - 1);

        this.fetchData(id, siteIdx, this.kw);

        this.statusHeight = Taro.getSystemInfoSync().statusBarHeight;

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
    }

    onShareAppMessage () {
        const shareData = setShareInfo();
        return shareData;
    }

    fetchData (id, site, kw) {
        // 清空一下store
        const { dispatch } = this.props;
        dispatch(clearLastShareList());
        dispatch(getMovieInfo({ id }));
        dispatch(getShareInfo({ site, kw }));
    }

    isLogin () {
        const { userData } = this.props;
        return !!Object.keys(userData).length;
    }

    getUserInfo ({ detail }) {
        // 拿到用户信息进行下一步处理
        this.setState({ isOpened: false });
        setUserInfo(detail, this.props.dispatch);
    }

    backToPre () {
        console.log('back to pre page');

        if (Taro.getCurrentPages().length > 1) {
            Taro.navigateBack();
        } else {
            Taro.switchTab({url: '/pages/index/index'});
        }
    }

    switchMovieTab (idx) {
        if (this.activeIdx === idx) return;
        this.setState({
            siteIdx: idx
        });
        const { shareList } = this.props;
        const { loaded, info } = shareList;

        if (!loaded) return;
        if (info[`site${idx}`].length) return;

        this.props.dispatch(getShareInfo({ site: idx, kw: this.kw }));
    }

    copyContent (data, isShowModal) {
        // 要检查有没有登录
        const isLogin = this.isLogin();
        if (!isLogin) {
            this.setState({ isOpened: true });
            return;
        }

        const { userData, shareList } = this.props;
        const { got } = shareList;
        const { _id, coin, isVip, nick, avatar } = userData;

        // 判断一下之前获取过没有
        const isGotten = got.includes(this.movieId);
        const __self = this;

        if (!isShowModal || isVip || isGotten) {
            Taro.setClipboardData({ data: data || '' });
            return;
        }

        if (coin - 20 <= 0) {
            Taro.showModal({
                content: '啊哦，金币数不足啦！\r\n观看视频即可获得金币哦！',
                success (res) {
                    if (res.confirm) {
                        __self.showVideo();
                    }
                }
            });
            return;
        }

        Taro.showModal({
            content: `消耗10金币即可复制～\r\n目前剩余金币数: ${coin}`,
            success (res) {
                if (res.confirm) {
                    Taro.setClipboardData({ data });
                    // 前端更新coin储存
                    const nowCoin = coin - 10;
                    __self.props.dispatch(updateGotten(__self.movieId));
                    updateCoin({_id, coin: nowCoin, nick, avatar, isVip }, __self.props.dispatch);
                }
            }
        });
    }

    showVideo () {
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

    renderStar (star) {
        const ten = Math.floor(star / 10);
        const half = +!!(star % 10);
        const fullStarArr = new Array(ten).fill(1);
        const emptyStarArr = new Array(5 - ten - half).fill(1);

        const fullStar = fullStarArr.map((item, key) =>
            <View className='detail-score__star-item full' key={`star_${key}`}></View>
        );
        const emptyStar = emptyStarArr.map((item, key) =>
            <View className='detail-score__star-item empty' key={`star_${ten+half+key}`}></View>
        );

        return (
            <View className='detail-score__star'>
                {fullStar}
                { !!half && (<View className='detail-score__star-item half' key={ten+half-1}></View>) }
                {emptyStar}
            </View>
        );
    }

    renderShareList (loaded, mapShareList) {
        return (
            <View className='detail-share'>
                { !loaded && <View className='detail-share__loading'></View> }
                { loaded && !mapShareList.length &&
                    <View className='detail-share__empty'>{decodeURIComponent('%E6%B2%A1%E6%9C%89%E6%89%BE%E5%88%B0%E5%93%A6')}😭</View>
                }
                {
                    loaded && mapShareList.map((item, key) => (
                        <View key={`share_${key}`} className='detail-share__item'>
                            <Text className='detail-share__item-text'>{item.name}</Text>
                            <Button
                                size='mini'
                                onClick={this.copyContent.bind(this, item.shareUrl, true)}
                            >
                                {decodeURIComponent('%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5')}
                            </Button>
                            <Button
                                onClick={this.copyContent.bind(this, item.password, false)}
                                className='copy-psw'
                                size='mini'
                            >
                                {decodeURIComponent('%E5%A4%8D%E5%88%B6%E5%AF%86%E7%A0%81')}
                            </Button>
                        </View>
                    ))
                }
            </View>
        );
    }

    renderSwitchTab () {
        const { siteIdx } = this.state;
        return (
            <View className='detail-tab'>
                <View
                    onClick={this.switchMovieTab.bind(this, 0)}
                    className={`detail-tab__item ${!siteIdx ? 'active' : ''}`}
                >
                    <Text className='detail-tab__text'>平台1</Text>
                </View>
                <View
                    onClick={this.switchMovieTab.bind(this, 1)}
                    className={`detail-tab__item ${siteIdx === 1 ? 'active' : ''}`}
                >
                    <Text className='detail-tab__text'>平台2</Text>
                </View>
                <View
                    onClick={this.switchMovieTab.bind(this, 2)}
                    className={`detail-tab__item ${siteIdx === 2 ? 'active' : ''}`}
                >
                    <Text className='detail-tab__text'>平台3</Text>
                </View>
            </View>
        );
    }

    renderSiteSwitch () {
        const { siteIdx } = this.state;
        const { shareList } = this.props;
        const { loaded, info, open } = shareList;
        if (!open) return null;

        const mapShareList = info[`site${siteIdx}`] || [];

        return (
            <View className='detail-other'>
                {this.renderSwitchTab()}
                <View className='detail-tip'>
                    👉 {decodeURIComponent('%E7%82%B9%E5%87%BB%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5%E5%88%B0%E6%B5%8F%E8%A7%88%E5%99%A8%E6%89%93%E5%BC%80%E5%93%9F%EF%BC%81')}
                </View>
                {this.renderShareList(loaded, mapShareList)}
            </View>
        );
    }

    renderAd () {
        return (
            <Ad unit-id='adunit-adb17a63fc2a61f3' ad-type='grid' grid-opacity='0.8' grid-count='5' ad-theme='white' />
        );
    }


    renderMain () {
        const { movieInfo } = this.props;
        const { info, loaded } = movieInfo;
        const { isOpened } = this.state;
        if (!loaded) return null;

        const { cover, extraInfo, summary, score, shortText, poster, star } = info;

        return (
            <View className='detail'>
                <AtModal isOpened={isOpened} closeOnClickOverlay>
                    <AtModalContent className='detail-login__ctn'>啊哦！登录后才可获取哦～</AtModalContent>
                    <AtModalAction>
                        <Button className='detail-login__btn' openType='getUserInfo' onGetUserInfo={this.getUserInfo.bind(this)}>立即登录</Button>
                    </AtModalAction>
                </AtModal>
                <View className='detail-bg' style={{height: this.statusHeight + 260}}>
                    <View className='detail-bg__pic'>
                        <Image src={poster} mode='widthFix' />
                    </View>
                    <View className='detail-bg__circle' />
                </View>
                <View
                    className='detail-back'
                    onClick={this.backToPre.bind(this)}
                    style={{top: this.statusHeight + 8}}
                />
                <View className='detail-main' style={{top: this.statusHeight - 20}}>
                    <View className='detail-pic'>
                        <Image src={cover} />
                    </View>
                    <View className='detail-title'>
                        <Text>{this.title}</Text>
                    </View>
                    <View className='detail-score'>
                        <View className='detail-score__text'>
                            { !score && <View style={{fontSize: 13}}>暂无评分</View> }
                            {
                                !!score && <View>
                                    <Text className='detail-score__ten'>{score.split('.')[0]}</Text>
                                    <Text>.</Text>
                                    <Text className='detail-score__unit'>{score.split('.')[1]}</Text>
                                </View>
                            }
                        </View>
                        {this.renderStar(star)}
                    </View>
                    <View className='detail-extra'>
                        <Text>{extraInfo}</Text>
                    </View>
                    <View className='detail-comment'>
                        <View className='detail-comment__icon'></View>
                        <Text className='detail-comment__text'>{shortText}</Text>
                    </View>
                    <View className='detail-summary'>
                        <Text>{summary}</Text>
                    </View>
                    {this.renderAd()}
                    {this.renderSiteSwitch()}
                </View>
            </View>
        );
    }

    render () {
        return this.renderMain();
    }
}

Detail.enableShareAppMessage = true;

export default connect(
    ({ movieInfo, shareList, userInfo }) => {
        return { movieInfo, shareList, userData: userInfo.info };
    }
)(Detail);
