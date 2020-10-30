// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')
const { OPEN } = require('./config');

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud['laigedianying-mini']
});

const db = cloud.database({
  env: cloud['laigedianying-mini']
});

async function getUser(OPENID) {
  const users = await db.collection('users').where({
    _openid: OPENID
  }).get();

  console.log('get users', users, OPENID);

  if (!users.data.length) return null;

  return (users.data)[0];
}

async function insertUser(OPENID, info, date) {
  const { nick, avatar } = info;
  const { _id } = await db.collection('users').add({
    data: {
      coin: 100, 
      nick, 
      avatar, 
      isVip: false, 
      isAdmin: false,
      _openid: OPENID,
      activeDate: date
    }
  });

  return { _id, nick, avatar, coin: 100, isVip: false };
}

async function updateUserCoin(_id, coin, date) {
  let updateCoin = coin;

  if (updateCoin === undefined) {
    const user = await db.collection('users').doc(_id).get();
    updateCoin = user.data.coin + 20;
  }

  await db.collection('users').doc(_id).update({
    data: { coin: updateCoin, activeDate: date }
  });
}

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 */

exports.main = async (params) => {
  const wxContext = cloud.getWXContext()
  const { OPENID } = wxContext;
  const today = new Date().getDate();

  switch (params.type) {
    case 'get': {
      // 查找
      let user = await getUser(OPENID);
      let nowCoin = 0;
      // 插入
      if (!user) {
        user = await insertUser(OPENID, params, today);
        nowCoin = user.coin;
      } else {
        // 是否今日首次登录
        const { activeDate, coin, _id } = user;
        nowCoin = coin;
        
        // 去掉加金币
        // if (today !== activeDate) {
        //   // 每天登录加10
        //   nowCoin = coin + 10;
        //   updateUserCoin(_id, nowCoin, today);
        // }
      }
    
      const { _id, nick, avatar, isVip } = user;
      return { retcode: 0, result: { nick, avatar, _id, isVip, coin: nowCoin, open: OPEN } }
    }
      
    case 'update':
      const { _id, nick, avatar, coin, isVip } = params;
      updateUserCoin(_id, coin, today);
      return { retcode: 0, result: { _id, nick, avatar, coin, isVip } }
    default:
      break;
  }
}

