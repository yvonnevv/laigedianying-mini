import Taro from '@tarojs/taro';

export function getCloudApi (name, data, callback) {
    return Taro.cloud.callFunction({
        name,
        data
    }).then(res => {
        const { result } = res;
        const { retcode } = result;
        // TODO
        if (!retcode) callback && callback(result.result);
    });
}