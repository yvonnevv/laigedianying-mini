const request = require('async-request');
const { DOUBAN } = require('./config');

module.exports = async function getQuote() {
  const pn = Math.floor(Math.random() * 3);
  const quotes = await request(`${DOUBAN.quote}&pn=${pn}`);
  const { statusCode, body } = quotes;
  if (statusCode === 200 && body) {
    return {
      retcode: 0,
      result: Object.assign({}, JSON.parse(body))
    }
  } else {
    return { retcode: 1, errmsg: 'get quote list api error' }
  }
}