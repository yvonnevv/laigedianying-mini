import React, { Component } from 'react'
import { connect } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components'
import { getArticles, getToken } from '../../actions';

import './index.less'

class ArticleSwiper extends Component {
    state = {
        current: 0
    }

    componentWillMount() {
        const { fetchArticle } = this.props;
        this.init().then(token => {
            fetchArticle({ token });
        });
        // this.props.dispatch(getToken());
        // this.props.dispatch(getArticles());
    }

    init() {
        // 获取token
        const weappToken = Taro.getStorageSync('weapp_token');
        const isExpires = weappToken && (weappToken.expires <= Date.now());
        const { fetchToken } = this.props;

        return new Promise((resolve) => {
            if (!weappToken || isExpires) {
                fetchToken(res => {
                    console.log('tokenres', res);
                    const { access_token, expires_in } = res;
                    const expires = Date.now() + expires_in * 1000;

                    resolve(access_token);

                    Taro.setStorageSync('weapp_token', {
                        content: access_token,
                        expires
                    });
                });
            } else {
                resolve(weappToken.content);
            }
        });
    }

    swiperChage = ({ detail }) => {
        this.setState({
            current: detail.current
        });
    }

    navigateTo = (url) => {
        Taro.navigateTo({
            url: `../webview/index?url=${encodeURIComponent(url)}`
        });
    }

    renderArticles() {
        const { current } = this.state;
        const { articles } = this.props;
        const { info, loaded } = articles;
        if (!loaded) return null;
        const mapInfos = [...info.all].splice(0, 4);

        const swipers = mapInfos.map((item, key) => (
            <SwiperItem key={`swiper_${key}`} onClick={this.navigateTo.bind(this, item.url)}>
                <View className='home-articles__item'>
                    <Image src={item.thumbUrl}></Image>
                    <View className='home-articles__item-text'><Text>{item.title}</Text></View>
                </View>
            </SwiperItem>
        ));

        const dots = mapInfos.map((item, key) => (
            <View
                className={
                    key === current
                        ? 'home-articles__item-dot active'
                        : 'home-articles__item-dot'
                }
                key={`swiper_dot_${key}`}
            />
        ));

        return (
            <View className='home-articles'>
                <Swiper
                    className='home-articles__swiper'
                    onChange={this.swiperChage}
                    circular
                    autoplay
                >
                    {
                        swipers
                    }
                </Swiper>
                <View className="home-articles__item-dots">
                    {dots}
                </View>
            </View>
        )
    }

    render() {
        return (
            <View className='index'>
                <Button onClick={this.getLogin}>获取登录云函数</Button>
                <Text>context：{JSON.stringify(this.state.context)}</Text>
            </View>
        )
    }
}


export default connect(
    ({ articles }) => { return { articles } },
    dispatch => {
        return {
            fetchToken(callback) {
                return dispatch(getToken(callback));
            },
            fetchArticle(params) {
                return dispatch(getArticles(params));
            }
        }
    }
)(ArticleSwiper);
