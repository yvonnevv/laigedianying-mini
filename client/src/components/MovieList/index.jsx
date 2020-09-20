import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ScrollView, Image, Text } from '@tarojs/components';
import { getMovieList } from '../../actions';

import './index.less';

class MovieList extends Component {
    state = {
        list: {}
    }

    componentWillMount() {
        const { type } = this.props;
        this.props.fetchMovieList({
            type
        });
    }

    onScrollToUpper() { }

    onScroll(e) {
        console.log(e.detail)
    }

    renderList() {
        const { movieList, type } = this.props;
        const { loaded, list } = movieList;
        if (!loaded) return null;

        const mapList = type ? list.highscore : list.hot;
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
            <ScrollView
                className='scrollview'
                scrollY
                scrollWithAnimation
                lowerThreshold={20}
                upperThreshold={20}
                onScrollToUpper={this.onScrollToUpper.bind(this)} // 使用箭头函数的时候 可以这样写 `onScrollToUpper={this.onScrollToUpper}`
                onScroll={this.onScroll}
                enableFlex={true}
            >
                <View className='scrollview-main'>
                    {this.renderList()}
                </View>
            </ScrollView>
        )
    }
}

export default connect(
    ({ movieList }) => { return { movieList } },
    dispatch => {
        return {
            fetchMovieList(params) {
                return dispatch(getMovieList(params));
            }
        }
    }
)(MovieList);
