const request = require('async-request');
const {
  APP_ID,
  APP_SECRET,
  CGI_TOKEN,
  CGI_MATERIAL
} = require('./config');

let token = '';
let expires = 0;

async function getToken() {
  const tokenRes = await request(`${CGI_TOKEN}&appid=${APP_ID}&secret=${APP_SECRET}`);
  const {
    statusCode,
    body
  } = tokenRes;
  if (statusCode === 200 && body) {
    console.log('body', body);
    const {
      access_token,
      expires_in
    } = JSON.parse(body);
    token = access_token;
    expires = Date.now() + (expires_in * 1000);
  };
}

async function getArticles(params) {
  const now = Date.now();
  if (expires <= now) await getToken();
  // await getToken();
  const articleRes = await request(`${CGI_MATERIAL}${token}`, {
    method: 'POST',
    data: JSON.stringify({
      offset: params.offset || 0,
      count: params.count || 10,
      type: 'news'
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const {
    statusCode,
    body
  } = articleRes;
  console.log('body', body);
  try {
    if (statusCode === 200 && body) {
      return {
        retcode: 0,
        result: JSON.parse(body)
      }
    } else {
      return {
        retcode: 1,
        errmsg: 'get articles wechat api error'
      }
    };
  } catch (error) {
    return {
      retcode: 1,
      errmsg: `get articles wechat api error ${error}`
    }
  }

}

exports.main = async (params) => {
  return await getArticles(params);
}