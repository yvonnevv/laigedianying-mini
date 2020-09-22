export default {
  pages: [
    'pages/index/index',
    'pages/recommend/index',
    'pages/me/index',
    'pages/detail/index'
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
      iconPath: 'assets/images/home-selected.png',
      text: '首页'
    }, {
      pagePath: 'pages/recommend/index',
      selectedIconPath: 'assets/images/recommend-selected.png', 
      iconPath: 'assets/images/recommend.png', 
      text: '推荐'
    }, {
      pagePath: 'pages/me/index',
      selectedIconPath: 'assets/images/mine-selected.png',
      iconPath: 'assets/images/mine.png',
      text: '我的'
    }]
  } 
}
