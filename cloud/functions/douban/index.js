const request = require('async-request');
const superagent = require('superagent');
const cheerio = require('cheerio');

const {
    DOUBAN
} = require('./config');

const {
    decrypt
} = require('./decrypt');

async function getMovieList({
    tag = 0,
    page_start = 0,
    page_limit = 10,
}) {
    const parseTag = tag ? '高分' : '热门';
    const movies = await request(`${DOUBAN.list}?type=movie&tag=${encodeURIComponent(parseTag)}&page_start=${page_start}&page_limit=${page_limit}`);
    const {
        statusCode,
        body
    } = movies;
    if (statusCode === 200 && body) {
        return {
            retcode: 0,
            result: Object.assign({}, JSON.parse(body), {
                tag
            })
        }
    } else {
        return {
            retcode: 1,
            errmsg: 'get douban list api error'
        }
    };
}

function infoParse(infoText) {
    infoText = infoText.split(':')[1].trim();
    let infoArr = infoText.split(' / ');
    let parseInfoText = '';

    infoArr = infoArr.splice(0, 2);
    infoArr.forEach(item => {
        parseInfoText += `#${item} `;
    });

    return parseInfoText.trim();
}

async function getMovieInfo({
    id
}) {
    const uri = `${DOUBAN.info}/${id}`;
    try {
        const docs = await superagent.get(uri);
        const $ = cheerio.load(docs.text);

        const summary = $('#link-report span').text().trim();
        const infosArr = $('#info').text().split('\n');
        const score = $('.rating_wrap .rating_num').text();
        const star = /\d+/.exec($('.bigstar').attr('class'))[0];
        const cover = $('#mainpic img').attr('src');
        const posterDom = $('.label-trailer .related-pic-video');
        const shortComment = $('#hot-comments .short');

        let poster = '';

        if (posterDom[0]) {
            poster = /background-image:url\((.*)\)/.exec(posterDom[0].attribs.style)[1];
        }

        let shortText = '';

        Array.from(shortComment).forEach(short => {
            const dataText = short.children[0].data;
            console.log('dataText', dataText);
            if (!shortText && dataText.length >= 15 && dataText.length <= 120) shortText = short.children[0].data;
        });

        let typeText = infosArr.filter(info => /类型/.test(info))[0];
        let countriesText = infosArr.filter(info => /国家|地区/.test(info))[0];
        let actorsText = infosArr.filter(info => /主演/.test(info))[0];
        let year = /\d+/.exec($('#content .year').text())[0];


        const type = infoParse(typeText);
        const countries = infoParse(countriesText);
        const actors = infoParse(actorsText);

        const extraInfo = `#${year} ${countries} ${type} ${actors}`;

        return {
            retcode: 0,
            result: {
                extraInfo,
                summary,
                score,
                star,
                cover,
                shortText,
                poster
            }
        }

    } catch (error) {
        return {
            retcode: 1,
            errmsg: `get douban info api error: ${error}`
        }
    }
}

async function searchMovie({
    name
}) {
    const uri = `${DOUBAN.search}${encodeURIComponent(name)}`;

    try {
        const docs = await superagent.get(uri);
        const decryptCtn = /window.__DATA__ = "([^"]+)"/.exec(docs.text);
        const data = decrypt(decryptCtn[1]) || {
            playload: {}
        };

        return {
            retcode: 0,
            result: {
                ...data.playload
            }
        }
    } catch (error) {
        return {
            retcode: 1,
            errmsg: `[search] douban info api error: ${error}`
        }
    }
}

exports.main = async ({
    type,
    params
}) => {
    switch (type) {
        case 'movieList':
            return await getMovieList(params);
        case 'movieInfo':
            return await getMovieInfo(params);
        case 'movieSearch':
            return await searchMovie(params);
        default:
            return;
    }
}