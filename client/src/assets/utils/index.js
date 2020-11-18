import Taro, { Current } from '@tarojs/taro';
import { getUserInfo, updateUserInfo } from '../../actions';
import { getCloudApi } from '../../actions/utils';

let scene = 1001, shareId = '';
const scenes = [1007, 1008, 1044];

export function setEnterInfo (curScene, curShareId) {
    scene = curScene;
    shareId = curShareId;
}

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
    // let isFirstLogin = false;
    if (userinfo.errMsg === 'getUserInfo:ok') {
        const rawData = JSON.parse(userinfo.rawData);
        // 拉一下金币
        const userData = Taro.getStorageSync('userData');
        const updateCoinFn = data => {
            const isValidShareId = shareId && shareId !== data._id;
            if (scenes.includes(scene) && isValidShareId) {
                console.log('邀请新用户成功！', shareId);
                getCloudApi('login', {_id: shareId, type: 'update'});
            }
        };
        // 初始化小程序或者登录成功都会调用
        dispatch(getUserInfo({
            nick: rawData.nickName,
            avatar: rawData.avatarUrl
        }, data => {
            // 邀请好友判断
            !userData && updateCoinFn(data);
            // isFirstLogin = true;
            Taro.setStorage({
                key: 'userData',
                data: JSON.stringify(data)
            });
        }));
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

export function setShareInfo () {
    const userData = Taro.getStorageSync('userData');
    const { path, params } = Current.router;
    const { id, title } = params;
    let userAppId = '', pathStr = `${path}?`;
    if (userData) {
        userAppId = JSON.parse(userData)._id;
        pathStr += `shareId=${userAppId}&`;
    }
    if (id) pathStr += `id=${id}&`;
    if (title) pathStr += `title=${title}&`;

    pathStr = pathStr.substring(0, pathStr.length - 1);
    console.log('pathStr', pathStr);

    return {
        title: '找片不迷路！',
        path: pathStr
    };
}

export function createRewardedVideoAd (callback) {
    const vAd = Taro.createRewardedVideoAd({adUnitId: 'adunit-ade8a4318c4bac59'});
    vAd.onLoad(() => {});
    vAd.onError((err) => {
        console.log('拉取失败:', err);
    });
    vAd.onClose((res) => {
        if (res && res.isEnded) {
            Taro.showToast({
                title: '金币+10!',
                icon: 'success'
            });
            callback && callback();
        } else {
            console.log('播放中途退出，不下发游戏奖励');
        }
    });
    return vAd;
}