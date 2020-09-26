import React, { Component } from 'react';
import { connect } from 'react-redux';
import Taro, { Current } from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import './index.less';
import { getMovieInfo, getShareInfo, clearLastShareList } from '../../actions';

import ICON_QUOTE from './images/icon-quote.png';

class Detail extends Component {
    constructor () {
        super();
        this.statusHeight = 0;
        this.state = {
            siteIdx: 0
        };
    }

    componentWillMount () {
        const { params } = Current.router;
        const { id, title: kw } = params;
        const { siteIdx } = this.state;

        // 清空一下store
        this.props.clearList();

        this.kw = decodeURIComponent(kw);
        this.kw = decodeURIComponent(this.kw).split(' ')[0];
        this.title = this.kw;
        this.kw = this.kw.substring(0, this.kw.length - 1);

        this.props.fetchMovieInfo({ id });
        this.props.fetchShareList({ site: siteIdx, kw: this.kw });

        this.statusHeight = Taro.getSystemInfoSync().statusBarHeight;
    }

    backToPre () {
        console.log('back to pre page');

        if (Taro.getCurrentPages().length > 1) {
            Taro.navigateBack();
        } else {
            Taro.navigateTo({
                url: '/pages/search/index'
            });
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

        this.props.fetchShareList({ site: idx, kw: this.kw });
    }

    copyContent (data) {
        Taro.setClipboardData({ data });
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

    renderShareList () {
        const { siteIdx } = this.state;
        const { shareList } = this.props;
        const { loaded, info } = shareList;
        const mapShareList = info[`site${siteIdx}`] || [];

        return (
            <View className='detail-share'>
                { !loaded && <View className='detail-share__loading'></View> }
                { loaded && !mapShareList.length && <View className='detail-share__empty'>暂无资源😢</View> }
                {
                    loaded && mapShareList.map((item, key) => (
                        <View key={`share_${key}`} className='detail-share__item'>
                            <Text className='detail-share__item-text'>{item.name}</Text>
                            <Button
                                size='mini'
                                onClick={this.copyContent.bind(this, item.shareUrl)}
                            >
                                复制链接
                            </Button>
                            <Button
                                onClick={this.copyContent.bind(this, item.password)}
                                className='copy-psw'
                                size='mini'
                            >
                                复制密码
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
                    <Text className='detail-tab__text'>站点1</Text>
                </View>
                <View
                    onClick={this.switchMovieTab.bind(this, 1)}
                    className={`detail-tab__item ${siteIdx === 1 ? 'active' : ''}`}
                >
                    <Text className='detail-tab__text'>站点2</Text>
                </View>
                <View
                    onClick={this.switchMovieTab.bind(this, 2)}
                    className={`detail-tab__item ${siteIdx === 2 ? 'active' : ''}`}
                >
                    <Text className='detail-tab__text'>站点3</Text>
                </View>
            </View>
        );
    }

    renderSiteSwitch () {
        return (
            <View className='detail-other'>
                {this.renderSwitchTab()}
                <View className='detail-tip'>
                    👉 点击复制链接到浏览器打开哟！
                </View>
                {this.renderShareList()}
            </View>
        );
    }

    renderMain () {
        const { movieInfo } = this.props;
        const { info, loaded } = movieInfo;
        if (!loaded) return null;

        const { cover, extraInfo, summary, score, shortText, poster, star } = info;

        return (
            <View className='detail'>
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
                        {ICON_QUOTE && (
                            <View className='detail-comment__icon'>
                                <Image src='./images/icon-quote.png' />
                            </View>
                        )}
                        <Text className='detail-comment__text'>{shortText}</Text>
                    </View>
                    <View className='detail-summary'>
                        <Text>{summary}</Text>
                    </View>
                    {this.renderSiteSwitch()}
                </View>
            </View>
        );
    }

    render () {
        return this.renderMain();
    }
}

export default connect(
    ({ movieInfo, shareList }) => {
        return { movieInfo, shareList };
    },
    (dispatch) => {
        return {
            fetchMovieInfo (params) {
                return dispatch(getMovieInfo(params));
            },
            fetchShareList (params) {
                return dispatch(getShareInfo(params));
            },
            clearList () {
                dispatch(clearLastShareList());
            }
        };
    }
)(Detail);
