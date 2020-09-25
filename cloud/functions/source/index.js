const cheerio = require('cheerio');
const {
  SITE,
  UA
} = require('./config');
const userAgent = UA[Math.floor(Math.random() * UA.length)];
const request = require('async-request');

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
 * 站点1：lili
 * @param {*} keyword 
 */
async function startCrawlLiLi(keyword) {
  try {
    const wrapperUrl = `${SITE[0]}${encodeURIComponent(keyword)}`;
    const shareLinks = [];
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
    const searchNode = $('h1:contains("搜索结果：")');
    if (!searchNode.length) {
      const shareNode = $('p:contains("密码：LXXH")');
      const fullName = $('h1.entry-title').text();
      const {
        name,
        desc
      } = __parseName(fullName);
      shareNode.each((index, share) => {
        const shareLink = $(share).find('a').attr('href');
        shareLinks.push({
          shareLink,
          name,
          desc
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
          const shareLink = shareNode.eq(idx).find('a').attr('href');
          shareLinks.push({
            shareLink,
            name,
            desc
          });
        });
      }));
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
    const shareLinks = [];
    const docs = await __crawlContent(wrapperUrl);
    // return;
    const $ = cheerio.load(docs);
    // 有无找到
    const isEmpty = $('h1:contains("暂无此资源")');
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

    return shareLinks;
  } catch (error) {
    return `get jieyou error ${error.message}`;
  }

}


exports.main = async ({ site, kw }) => {
  let shareLinks = [];
  switch (site) {
    case 0:
      shareLinks = await startCrawlLiLi(kw);
      break;
    case 0:
      shareLinks = await startCrawlAi(kw);
      break;
    case 0:
      shareLinks = await startCrawlJieYou(kw);
      break;
    default:
      break;
  }

  return typeof shareLinks === 'string'
    ? { retcode: 1, errmsg: shareLinks }
    : { retcode: 0, shareLinks }
}