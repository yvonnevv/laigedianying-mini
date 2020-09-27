// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

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

async function insertUser(OPENID, info) {
  const { nick, avatar } = info;
  const { _id } = await db.collection('users').add({
    data: {
      coin: 100, 
      nick, 
      avatar, 
      isVip: false, 
      isAdmin: false,
      _openid: OPENID
    }
  });

  return { _id, nick, avatar, coin: 100, isVip: false };
}

async function updateUserCoin(_id, coin) {
  await db.collection('users').doc(_id).update({
    data: { coin }
  });
}

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 */

exports.main = async (params) => {
  const wxContext = cloud.getWXContext()
  const { OPENID } = wxContext;

  switch (params.type) {
    case 'get': {
      // 查找
      let user = await getUser(OPENID);
      // 插入
      if (!user) {
        user = await insertUser(OPENID, params);
      }
      const { _id, nick, avatar, coin, isVip } = user;
      return { retcode: 0, result: { nick, avatar, _id, isVip, coin } }
    }
      
    case 'update':
      const { _id, nick, avatar, coin, isVip } = params;
      updateUserCoin(_id, coin);
      return { retcode: 0, result: { _id, nick, avatar, coin, isVip } }
    default:
      break;
  }
}

