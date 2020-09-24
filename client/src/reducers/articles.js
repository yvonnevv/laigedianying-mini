import {
    GET_ARTICLE,
    GET_ARTICLE_SUCCESS
} from '../actions';

export function articles (state = {
    info: {
        all: [],
        list: [], // 影单
        review: [] // 影评
    },
    loaded: true
}, action) {
    const { type } = action;
    let update = {};
    switch (type) {
    case GET_ARTICLE:
        update = { loaded: false };
        break;
    case GET_ARTICLE_SUCCESS: {
        const list = [];
        const review = [];
        const all = action.data.map(item => {
            const { content } = item;
            const { news_item } = content;
            const { thumb_url, title, url } = news_item[0];
            const itemPrase = {
                thumbUrl: thumb_url, title, url
            };
            if (/^(|)((?!《|》).)*$/.test(title)) {
                list.push(itemPrase);
            } else {
                review.push(itemPrase);
            }
            return itemPrase;
        });
        update = {
            loaded: true,
            info: {
                all, list, review
            }
        };
        break;
    }
    default:
        break;
    }

    return Object.keys(update).length ? Object.assign({}, state, update) : state;
}