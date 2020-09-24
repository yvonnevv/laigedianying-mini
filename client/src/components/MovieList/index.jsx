import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { connect } from 'react-redux';
import { View, Image, Text } from '@tarojs/components';

import './index.less';

class MovieList extends Component {

    toDetail(id, title) {
        Taro.navigateTo({
            url: `../detail/index?id=${id}&title=${title}`
        });
    }

    renderList() {
        const { movieList, tag } = this.props;
        const { list } = movieList;
        const mapList = tag
            ? (tag === 1
                ? list.highscore
                : list.search
            ) : list.hot;

        if (!mapList || !mapList.length) return null;

        return mapList.map((item, key) => (
            <View
                className="scrollview-item"
                key={`scrollview-item-${key}`}
                onClick={this.toDetail.bind(this, item.id, item.title)}
            >
                <Image className="scrollview-item__cover" src={item.cover}></Image>
                <View className="scrollview-item__text">
                    {item.title}
                </View>
            </View>
        ));
    }

    render() {
        return (
            <View>
                <View className='scrollview-main'>
                    {this.renderList()}
                </View>
            </View>
        )
    }
}

export default connect(({ movieList }) => { return { movieList } })(MovieList);
