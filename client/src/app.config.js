export default {
  pages: [
    'pages/index/index',
    'pages/recommend/index',
    'pages/me/index'
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
      text: '首页'
    }, {
      pagePath: 'pages/recommend/index',
      text: '推荐'
    }, {
      pagePath: 'pages/me/index',
      text: '我的'
    }]
  } 
}
