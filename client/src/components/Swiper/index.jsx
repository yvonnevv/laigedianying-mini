import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Swiper, SwiperItem } from '@tarojs/components';

import './index.less';

export default class BannerSwiper extends Component {
    state = {
        current: 0
    }

    swiperChage = ({ detail }) => {
        this.setState({
            current: detail.current
        });
    }

    toHelpPage () {
        Taro.navigateTo({
            url: '/pages/help/index'
        });
    }

    renderSwiper () {
        const { current } = this.state;
        const { bannerList } = this.props;

        const swipers = bannerList.map((item, key) => (
            <SwiperItem onClick={this.toHelpPage} key={`swiper_${key}`} className={`swiper_${key}`}>
                <View className='home-banner__item'></View>
            </SwiperItem>
        ));

        const dots = bannerList.map((item, key) => (
            <View className={key === current ? 'home-banner__item-dot active' : 'home-banner__item-dot'} key={`swiper_dot_${key}`} />
        ));

        return (
            <View className='home-banner'>
                <Swiper className='home-banner__swiper' onChange={this.swiperChage} circular autoplay>
                    {
                        swipers
                    }
                </Swiper>
                <View className='home-banner__item-dots'>
                    {dots}
                </View>
            </View>
        );
    }

    render () {
        return this.renderSwiper();
    }
}