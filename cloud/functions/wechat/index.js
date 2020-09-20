
const request = require('async-request');
const {
    APP_ID, APP_SECRET, CGI_TOKEN, CGI_MATERIAL
} = require('./config');

async function getToken() {
    const tokenRes = await request(`${CGI_TOKEN}&appid=${APP_ID}&secret=${APP_SECRET}`);
    const { statusCode, body } = tokenRes;
    if (statusCode === 200 && body) {
        return {
            retcode: 0,
            result: JSON.parse(body)
        }
    } else {
        return {
            retcode: 1,
            errmsg: 'get token wechat api error'
        }
    };
}

async function getArticles({token, params = {}}) {
    if (!token) return {
        retcode: 1,
        result: {},
        errmsg: 'token is empty'
    }
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

    const { statusCode, body } = articleRes;
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

}

exports.main = async ({type, params}) => {
    console.log('type', type, params);
    switch(type) {
        case 'wxtoken':
            return await getToken();
        case 'articles':
            console.log('params', params);
            return await getArticles(params);
        default:
            return;
    }
}
