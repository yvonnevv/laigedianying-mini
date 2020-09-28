const request = require('async-request');
const { CGI_MATERIAL } = require('./config');

async function getArticles() {
  const articleRes = await request(`${CGI_MATERIAL}`);
  const { body } = articleRes;

  return JSON.parse(body)

}

exports.main = async () => {
  return await getArticles();
}