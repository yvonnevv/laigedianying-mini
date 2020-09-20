import Taro from '@tarojs/taro';

export function getCloudApi(name, data, callback) {
    console.log('data:', data);
    return Taro.cloud.callFunction({
        name,
        data
    }).then(res => {
        const { result } = res;
        const { retcode } = result;
        // TODO
        if (!retcode) callback(result.result);
    });
}