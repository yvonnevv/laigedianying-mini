import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { connect } from 'react-redux';
import { View, ScrollView, Input, Icon, Image, Text, Button } from '@tarojs/components';
import { getUserInfo, updateUserInfo } from '../../actions/member';

import LOGO_IMG from '../../assets/images/logo.png';

import './index.less';

class Member extends Component {
	constructor() {
		super();
		this.state = {
			inputVal: '',
			memberList: []
		};
	}

	onMemberConfirm({ detail }) {
    const nick = detail.value;
    if (!nick) return;
    this.props.getUserInfo(nick, (res) => {
			if (res.length) {
				this.setState({
					memberList: res
				});
			}
		});
  }
  
  setVip(item) {
    const { memberList } = this.state;
    this.props.updateUserInfo({ _id: item._id, setVip: !item.isVip }, (res) => {
      const { errMsg } = res;
      if (!errMsg) {
        const changeMember = memberList.filter(litem => litem._id = item._id);
        changeMember[0].isVip = !item.isVip;
        this.setState({ memberList });
      }
    });
  }

	renderMembers() {
		return (
			<View className="member-list">
				<View className="member-list__tit">
					<Text>昵称</Text>
					<Text>头像</Text>
					<Text>金币数</Text>
					<Text>设置会员</Text>
				</View>
				<View className="member-list__main">
					{this.state.memberList.map((item) => (
						<View className="member-list__item">
							<Text>{item.nick}</Text>
							<View>
								<Image src={item.avatar} />
							</View>
							<Text>{item.coin}</Text>
							<View>
                <Button 
                  size="mini" 
                  className={item.isVip ? 'disabled' : ''}
                  onClick={this.setVip.bind(this, item)}
                >
									{ item.isVip ? '关闭会员' : '开启会员' }
								</Button>
							</View>
						</View>
					))}
				</View>
			</View>
		);
	}

	renderInput() {
		return (
			<View className="member-input">
				<View className="member-input__main">
					<Input
						className="member-input__main-input"
						placeholder="输入用户昵称"
						placeholderClass="member-input__main-placeholder"
						type="member"
						onConfirm={this.onMemberConfirm.bind(this)}
					/>
					<Icon className="member-input__main-icon" type="member" size="14" />
				</View>
				{LOGO_IMG && <Image className="member-input__logo" src="../../assets/images/logo.png" />}
			</View>
		);
	}

	render() {
		return (
			<ScrollView className="member" scrollY scrollWithAnimation enableFlex>
				{this.renderInput()}
				{this.renderMembers()}
			</ScrollView>
		);
	}
}

export default connect(
	({ userInfo }) => {
		return { userData: userInfo.info };
	},
	(dispatch) => {
		return {
			getUserInfo(nick, callback) {
				return dispatch(getUserInfo({ nick }, callback));
      },
      updateUserInfo(params, callback)  {
        return dispatch(updateUserInfo(params, callback));
      }
		};
	}
)(Member);
