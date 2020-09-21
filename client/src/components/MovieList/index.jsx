import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image, Text } from '@tarojs/components';

import './index.less';

class MovieList extends Component {

    renderList() {
        const { movieList, tag } = this.props;
        const { loaded, list } = movieList;
        const mapList = tag ? list.highscore : list.hot;

        if (!loaded && !mapList.length) return null;
        
        return mapList.map((item, key) => (
            <View className="scrollview-item" key={`scrollview-item-${key}`}>
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
