const cheerio = require('cheerio');
const { SITE, UA, OPEN } = require('./config');
const userAgent = UA[Math.floor(Math.random() * UA.length)];
const request = require('async-request');
const superagent = require('superagent');

function __parseName(name) {
  let reg = /\]\[|\[|\]/g;
  if (~name.indexOf('】【')) {
      reg = /】【|【|】/g;
  }
  let nameArr = name.replace(reg, '**').split('**');
  nameArr = nameArr.filter(item => item);
  let nowName = nameArr[0], desc = '';
  nameArr.forEach((item, index) => {
      // 这个是年份的数字
      if (!index) return;
      if (!isNaN(item) && item) {
          nowName += `[${item}]`;
      } else {
          desc += ` ${item}`;
      }
  })

  return {
      desc: desc.trim(),
      name: nowName
  }
}

async function __crawlContent(url) {
  const docs = await request(url, {
    method: 'GET',
    headers: {
      'User-Agent': userAgent
    }
  });
  return docs.body;
}

/**
 * 补充站点 来个数据库
 * @param {*} keyword 
 */
async function requestLaige(keyword) {
  const { body } = await request(`${SITE[3]}${encodeURIComponent(keyword)}`);
  const { localMovies } = JSON.parse(body);
  return localMovies;
}

/**
 * 站点1：lili
 * @param {*} keyword 
 */
async function startCrawlLiLi(keyword) {
  try {
    let shareLinks = [];
    const wrapperUrl = `${SITE[0]}${encodeURIComponent(keyword)}`;
    const docs = await __crawlContent(wrapperUrl);
    const $ = cheerio.load(docs);
    // 有无找到
    const isEmpty = $('h1:contains("没有找到")');
    if (isEmpty.length) return shareLinks;
    const articles = $('article.post');
    let urls = [];
    // 精确查找
    articles.each((index, article) => {
      const link = $(article).find($('.entry-title a'));
      const linkText = link.text();
      const linkUrl = link.attr('href');
      const {
        name,
        desc
      } = __parseName(linkText);
      const reg = new RegExp(keyword);
      // 要获取实际的shareLink还需进入一层
      // 完全不包含keyword的直接剔除
      if (articles.length <= 2) {
        urls.push({
          name,
          desc,
          linkUrl
        });
      } else {
        if (reg.test(name)) urls.push({
          name,
          desc,
          linkUrl
        });
      }

    });

    // 精确查找
    if (urls.length > 4) {
      urls = urls.filter(({
        name
      }) => {
        return !name.indexOf(`[${keyword}`) || !name.indexOf(keyword);
      });
    }

    await Promise.all(urls.map(async ({
      linkUrl,
      name,
      desc
    }) => {
      const iDocs = await __crawlContent(linkUrl);
      const $_i = cheerio.load(iDocs);
      const shareNode = $_i('p:contains("视频：")');
      const testNode = $_i('a[href*="//pan.baidu.com"]')
      const testNodeArr = new Array(testNode.length).fill(1);
      testNodeArr.forEach((item, idx) => {
        const shareUrl = testNode.eq(idx).attr('href');
        const shareText = shareNode.eq(idx).text();
        let password, pwdText;
        if (testNode.eq(idx)[0].nextSibling) {
          pwdText = testNode.eq(idx)[0].nextSibling.nodeValue || shareText;
          if (/取码|密码/.test(pwdText)) {
            password = /[a-zA-Z0-9]{4}/.exec(pwdText)[0];
          }
        }
        shareLinks.push({
          shareUrl,
          name,
          desc,
          password
        });
      });
    }));

    if (!shareLinks.length) {
      shareLinks = await requestLaige(keyword);
    }

    return shareLinks;
  } catch (error) {
    return `get lili error ${error.message}`;
  }

}

/**
 * 站点2：爱电影
 * @param {*} keyword 
 */
async function startCrawlAi(keyword) {
  try {
    const wrapperUrl = `${SITE[1]}${encodeURIComponent(keyword)}`;
    const shareLinks = [];
    const docs = await __crawlContent(wrapperUrl);
    // return;
    const $ = cheerio.load(docs);
    // 有无找到
    const isEmpty = $('h2:contains("未找到")');
    if (isEmpty.length) return shareLinks;

    // 判断一下是否为内页 如果article.length为1
    const searchNode = $('span:contains("微信公众号")');

    if (searchNode.length) {
      const shareNode = $('p:contains("密码：LXXH")');
      const fullName = $('h1.entry-title').text();
      const {
        name,
        desc
      } = __parseName(fullName);
      shareNode.each((index, share) => {
        const shareUrl = $(share).find('a').attr('href');
        shareLinks.push({
          shareUrl,
          name,
          desc,
          password: 'LXXH'
        });
      });

      return shareLinks;
    } else {
      const articles = $('article.post');
      let urls = [];
      articles.each((index, article) => {
        const link = $(article).find($('.entry-title a'));
        const linkText = link.text();
        const linkUrl = link.attr('href');
        const {
          name,
          desc
        } = __parseName(linkText);
        const reg = new RegExp(keyword);
        // 要获取实际的shareLink还需进入一层
        // 完全不包含keyword的直接剔除
        console.log('name', name);
        if (reg.test(name)) urls.push({
          name,
          desc,
          linkUrl
        });
      });

      // 如果大于4个更精确地选取
      if (urls.length > 4) {
        urls = urls.filter(({
          name
        }) => {
          return !name.indexOf(`[${keyword}`) || !name.indexOf(keyword);
        });
      };

      await Promise.all(urls.map(async ({
        linkUrl,
        name,
        desc
      }) => {
        const iDocs = await __crawlContent(linkUrl);
        const $_i = cheerio.load(iDocs);
        const shareNode = $_i('p:contains("密码：LXXH")');
        const shareNodeArr = new Array(shareNode.length).fill(1);
        shareNodeArr.forEach((item, idx) => {
          const shareUrl = shareNode.eq(idx).find('a').attr('href');
          shareLinks.push({
            shareUrl,
            name,
            desc,
            password: 'LXXH'
          });
        });
      }));
      console.log('shareLinks', shareLinks);

      return shareLinks;
    }
  } catch (error) {
    return `get aidianying error ${error.message}`;
  }
}

/**
 * 站点3：美剧小菌
 * @param {*} keyword
 */
async function startCrawlJieYou(keyword) {
  try {
    const wrapperUrl = `${SITE[2]}${encodeURIComponent(keyword)}`;
    console.log('wrapperUrl', wrapperUrl);
    const shareLinks = [];
    const docs = await __crawlContent(wrapperUrl);
    // return;
    const $ = cheerio.load(docs);
    // 有无找到
    const isEmpty = $('h1:contains("暂无此资源")');
    console.log('isEmpty', isEmpty);
    if (isEmpty.length) return shareLinks;

    const searchList = $('.search_list li');
    let urls = [];
    searchList.each((index, item) => {
      const link = $(item).find($('.dytit a'));
      const linkText = link.text();
      const linkUrl = link.attr('href');
      const {
        name,
        desc
      } = __parseName(linkText);
      // 要获取实际的shareLink还需进入一层
      urls.push({
        name,
        desc,
        linkUrl
      });
    });
    // 精确查找
    if (urls.length > 4) {
      urls = urls.filter(({
        name
      }) => {
        return !name.indexOf(keyword);
      });
    }

    await Promise.all(urls.map(async ({
      linkUrl,
      name,
      desc
    }) => {
      const iDocs = await __crawlContent(linkUrl);
      const $_i = cheerio.load(iDocs);
      const shareNode = $_i('a[href*="//pan.baidu.com"]')
      const shareNodeArr = new Array(shareNode.length).fill(1);
      shareNodeArr.forEach((item, idx) => {
        const shareUrl = shareNode.eq(idx).attr('href');
        // const shareText = shareNode.eq(idx).text();
        let password;
        if (shareNode.eq(idx)[0].nextSibling) {
          const pwdText = shareNode.eq(idx)[0].nextSibling.nodeValue;
          if (/取码|密码/.test(pwdText)) {
            password = /[a-zA-Z0-9]{4}/.exec(pwdText)[0];
          }
        }
        shareLinks.push({
          shareUrl,
          name,
          desc,
          password
        });
      });
    }));

    console.log('shareLinks', shareLinks);

    return shareLinks;
  } catch (error) {
    return `get jieyou error ${error.message}`;
  }

}

/**
 * 百度云是否已经失效
 * @param {*} url 
 */
async function isValid(url) {
  const docs = await superagent
      .get(url)
  const $ = cheerio.load(docs.text);
  const inValidNode = $('.share-error-left');
  return !inValidNode.length;
}

exports.main = async ({ site, kw }) => {
  kw = kw.substring(0, kw.length - 1).split('：')[0];
  let shareLinks = [];
  if (OPEN && !/末日逃/.test(kw)) {
    switch (site) {
      case 0:
        shareLinks = await startCrawlLiLi(kw);
        break;
      case 1:
        shareLinks = await startCrawlAi(kw);
        break;
      case 2:
        shareLinks = await startCrawlJieYou(kw);
        break;
      default:
        break;
    }
  };

  const finalShareLinks = [];
  // 有效性检测
  if (OPEN && shareLinks instanceof Array && shareLinks.length) {
    await Promise.all(shareLinks.map(async link => {
      const isValidUrl = await isValid(link.shareUrl)
      if (isValidUrl) {finalShareLinks.push(link)}
      return link;
    }));
  }

  return typeof shareLinks === 'string'
    ? { retcode: 1, result: { errmsg: shareLinks } }
    : { retcode: 0, result: { shareLinks: finalShareLinks, open: OPEN } }
}