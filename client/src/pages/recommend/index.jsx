import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { connect } from 'react-redux';
import { View, Image, Text } from '@tarojs/components';
import { getArticles } from '../../actions';
import './index.less';

class Recommend extends Component {

    componentWillMount () {
        this.props.dispatch(getArticles({}));
    }

    showToast () {
        Taro.showToast({
            title: '紧张开发中～\r\n请关注公众号【来个电影】查看',
            icon: 'none'
        });
    }

    renderArticles () {
        const { articles } = this.props;
        const { info, loaded } = articles;
        console.log('loaded', loaded, info);
        if (!loaded) return null;

        const articlesList = info.all.map((item, key) => (
            <View onClick={this.showToast} className='recommend-articles__item' key={`article_${key}`}>
                <View className='recommend-articles__item-text'>
                    <Text>{item.title}</Text>
                    <Text className='subtitle'>{item.digest}</Text>
                </View>
                <Image src={item.thumbUrl}></Image>
            </View>
        ));

        return (
            <View className='recommend-articles'>
                {articlesList}
            </View>
        );
    }

    render () {
        return this.renderArticles();
    }
}

export default connect(({articles}) => { return { articles }; })(Recommend);
