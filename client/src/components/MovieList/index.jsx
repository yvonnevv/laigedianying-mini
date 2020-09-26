import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { connect } from 'react-redux';
import { View, Image } from '@tarojs/components';

import './index.less';

class MovieList extends Component {

    toDetail (id, title) {
        Taro.navigateTo({
            url: `../detail/index?id=${id}&title=${encodeURIComponent(title)}`
        });
    }

    renderList (mapList) {
        return mapList.map((item, key) => (
            <View
                className='scrollview-item'
                key={`scrollview-item-${key}`}
                onClick={this.toDetail.bind(this, item.id, item.title)}
            >
                <Image className='scrollview-item__cover' src={item.cover}></Image>
                <View className='scrollview-item__text'>
                    {item.title}
                </View>
            </View>
        ));
    }

    render () {
        const { movieList, tag } = this.props;
        const { list, loaded } = movieList;
        const mapList = tag
            ? (tag === 1
                ? list.highscore
                : list.search
            ) : list.hot;

        if (!mapList || !mapList.length) return null;
        const isShowLoading = !loaded && mapList.length;

        return (
            <View>
                <View className='scrollview-main'>
                    {this.renderList(mapList)}
                </View>
                {isShowLoading && <View className='scrollview-loading'></View> }
            </View>
        );
    }
}

export default connect(({ movieList }) => { return { movieList }; })(MovieList);
