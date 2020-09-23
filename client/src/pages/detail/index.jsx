import React, { Component } from 'react';
import { connect } from 'react-redux';
import Taro, { Current } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import './index.less';
import { getMovieInfo } from '../../actions';

const ICON_QUOTE = require('./images/icon-quote.png');

class Detail extends Component {

  statusHeight = 0

	componentWillMount() {
		const { params } = Current.router;
		const { id } = params;
    this.props.fetchMovieInfo({ id });
    this.statusHeight = Taro.getSystemInfoSync().statusBarHeight;
  }

  backToPre() {
    console.log('back to pre page');
    Taro.navigateBack();
  }
  
  renderStar(star) {
    const ten = Math.floor(star / 10);
    const half = +!!(star % 10);
    const fullStarArr = new Array(ten).fill(1);
    const emptyStarArr = new Array(5 - ten - half).fill(1);

    const fullStar = fullStarArr.map((item, key) => 
      <View className="detail-score__star-item full" key={`star_${key}`}></View>
    );
    const emptyStar = emptyStarArr.map((item, key) => 
      <View className="detail-score__star-item empty" key={`star_${ten+half+key}`}></View>
    );

    return (
      <View className="detail-score__star">
        {fullStar}
        { !!half && (<View className="detail-score__star-item half" key={ten+half-1}></View>) }
        {emptyStar}
      </View>
    )
  }

 	renderMain() {
		const { movieInfo } = this.props;
		const { info, loaded } = movieInfo;
		if (!loaded) return null;

		const { params } = Current.router;
		const { title } = params;
		const { cover, extraInfo, summary, score, shortText, poster, star } = info;

		return (
			<View className="detail">
				<View className="detail-bg">
					<View className="detail-bg__pic">
						<Image src={poster} mode="widthFix" />
					</View>
					<View className="detail-bg__circle" />
				</View>
        <View className="detail-back" onClick={this.backToPre} style={{top: this.statusHeight + 8}}></View>
				<View className="detail-main">
					<View className="detail-pic">
						<Image src={cover} />
					</View>
					<View className="detail-title">
						<Text>{title}</Text>
					</View>
					<View className="detail-score">
						<View className="detail-score__text">
              <Text className="detail-score__ten">{score.split('.')[0]}</Text>
              <Text>.</Text>
              <Text className="detail-score__unit">{score.split('.')[0]}</Text>
            </View>
            {this.renderStar(star)}
					</View>
					<View className="detail-extra">
						<Text>{extraInfo}</Text>
					</View>
					<View className="detail-comment">
						{ICON_QUOTE && (
							<View className="detail-comment__icon">
								<Image src="./images/icon-quote.png" />
							</View>
						)}
						<Text className="detail-comment__text">{shortText}</Text>
					</View>
					<View className="detail-summary">
						<Text>{summary}</Text>
					</View>
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
