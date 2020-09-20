
const request = require('async-request');
const {
    DOUBAN
} = require('./config');

async function getMovieList({
    tag = 0,
    page_start = 0,
    page_limit = 10,
}) {
    const parseTag = tag ? '高分' : '热门';
    const movies = await request(`${DOUBAN.list}?type=movie&tag=${encodeURIComponent(parseTag)}&page_start=${page_start}&page_limit=${page_limit}`);
    const { statusCode, body } = movies;
    if (statusCode === 200 && body) {
        return {
            retcode: 0,
            result: Object.assign({}, JSON.parse(body), { tag })
        }
    } else {
        return {
            retcode: 1,
            errmsg: 'get douban list api error'
        }
    };
}

async function getMovieInfo({ id }) {
    const uri = `${DOUBAN.info}/${id}`;
    try {
        const docs = await superagent
            .get(uri);
        const $ = cheerio.load(docs.text);
        const summary = $('#link-report span').text().trim();
        const infosArr = $('#info').text().split('\n');

        let type = infosArr.filter(info => /类型/.test(info))[0];
        let countries = infosArr.filter(info => /国家|地区/.test(info))[0];
        let actors = infosArr.filter(info => /主演/.test(info))[0];
        let year = $('#content .year').text();

        type = type.split(':')[1].trim();
        countries = countries.split(':')[1].trim();
        actors = actors.split(':')[1].trim();
        year = /\d+/.exec(year)[0]

        console.log(type, countries, actors, year);

        return {
            retcode: 0,
            result: {
                summary
            }
        }

    } catch (error) {
        return {
            retcode: 1,
            errmsg: `get douban info api error: ${error}`
        }
    }
}

exports.main = async ({ type, params }) => {
    switch (type) {
        case 'movieList':
            return await getMovieList(params);
        case 'movieInfo':
            console.log('params', params);
            return await getMovieInfo(params);
        default:
            return;
    }
}
