import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Current } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import './index.less';
import { getMovieInfo } from '../../actions';

const ICON_QUOTE = require('./images/icon-quote.png');

class Detail extends Component {
	componentWillMount() {
		const { params } = Current.router;
        const { id } = params;
		this.props.fetchMovieInfo({ id });
	}

	renderMain() {
        const { movieInfo } = this.props;
        const { info, loaded } = movieInfo;
        if (!loaded) return null;

        const { params } = Current.router;
        const { title } = params;
        const { cover, extraInfo, summary, score, shortText } = info;

		return (
			<View className="detail">
				<View className="detail-pic">
					<Image src={cover} />
				</View>
				<View className="detail-title">
                    <Text>{title}</Text>
				</View>
				<View className="detail-score">
                    <Text className="detail-score__ten">{score.split('.')[0]}</Text>
                    <Text>.</Text>
                    <Text className="detail-score__unit">{score.split('.')[0]}</Text>
				</View>
				<View className="detail-extra">
                    <Text>{extraInfo}</Text>
				</View>
				<View className="detail-comment">
					{ICON_QUOTE && <View className="detail-comment__icon"><Image src="./images/icon-quote.png" /></View>}
                    <Text className="detail-comment__text">{shortText}</Text>
				</View>
				<View className="detail-summary">
                    <Text>{summary}</Text>
				</View>
			</View>
		);
	}

	render() {
		return this.renderMain();
	}
}

export default connect(
	({ movieInfo }) => {
		return { movieInfo };
	},
	(dispatch) => {
		return {
			fetchMovieInfo(params) {
				return dispatch(getMovieInfo(params));
			}
		};
	}
)(Detail);
