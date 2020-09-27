import Taro from '@tarojs/taro';
import { getUserInfo, setDefaultUserInfo, updateUserInfo } from '../../actions';

/**
 * 获取登录态
 */
export function getLoginData (dispatch, success, fail) {
    let isLogin = false;
    Taro.getSetting({
        success (res) {
            if (res.authSetting['scope.userInfo']) {
                isLogin = true;
                Taro.getUserInfo({
                    success (userinfo) {
                        success && success();
                        setUserInfo(userinfo, dispatch);
                    }
                });
            } else {
                fail && fail();
            }
        },
    });

    return isLogin;
}

/**
 * 初始化没有信息的时候要拉一下接口
 * @param {*} value
 */
export function setUserInfo (userinfo, dispatch) {
    if (userinfo.errMsg === 'getUserInfo:ok') {
        const rawData = JSON.parse(userinfo.rawData);
        // 拉一下金币
        const userData = Taro.getStorageSync('userData');
        console.log('userData', userData);
        if (!userData) {
            dispatch(getUserInfo({
                nick: rawData.nickName,
                avatar: rawData.avatarUrl
            }, (data) => {
                console.log('SET STORAGE', data);
                Taro.setStorage({
                    key: 'userData',
                    data: JSON.stringify(data)
                });
            }));
        } else {
            dispatch(setDefaultUserInfo(JSON.parse(userData)));
        }
    }
}

export function updateCoin (data, dispatch) {
    Taro.setStorage({
        key: 'userData',
        data: JSON.stringify(data)
    });
    // 后台更新
    dispatch(updateUserInfo(data));
}