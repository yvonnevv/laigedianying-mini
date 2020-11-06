export default {
    pages: [
        'pages/index/index',
        'pages/me/index',
        'pages/detail/index',
        'pages/search/index',
        'pages/help/index',
        'pages/member/index'
    ],
    window: {
        backgroundTextStyle: 'light',
        navigationBarBackgroundColor: '#fff',
        navigationBarTitleText: 'WeChat',
        navigationBarTextStyle: 'black'
    },
    cloud: true,
    tabBar: {
        selectedColor: '#FF505B',
        color: '#2F2F2F',
        list: [{
            pagePath: 'pages/index/index',
            selectedIconPath: 'assets/images/home-selected.png',
            iconPath: 'assets/images/home.png',
            text: '首页'
        }, {
            pagePath: 'pages/search/index',
            selectedIconPath: 'assets/images/search-selected.png',
            iconPath: 'assets/images/search.png',
            text: '搜索'
        }, {
            pagePath: 'pages/me/index',
            selectedIconPath: 'assets/images/mine-selected.png',
            iconPath: 'assets/images/mine.png',
            text: '我的'
        }]
    }
};
