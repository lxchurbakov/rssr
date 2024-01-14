import axios from 'axios';
import { route, HttpError } from '/libs/utils';
import Parser from 'rss-parser';

import Entrypoint from './entrypoint';

const parser = new Parser();

const FEEDS_SOURCE = {
    gistId: '5e855f20a70d09e60e25431265666162',
    versionId: 'b061668cdae57526a9d63c69b999187db0740828',
    filename: 'feeds.json',
};

const fetchGist = async (gistId: string, versionId: string, filename: string) => {
    const { data } =  await axios.get(
        `https://gist.githubusercontent.com/lxchurbakov/${gistId}/raw/${versionId}/${filename}`
    );

    return data;
};  

export default class {
    constructor (private entrypoint: Entrypoint) {
        this.entrypoint.app.get('/feeds', route(async (req, res) => {
            const feeds = await fetchGist(
                FEEDS_SOURCE.gistId,
                FEEDS_SOURCE.versionId,
                FEEDS_SOURCE.filename,
            );

            return Promise.all(feeds.map(async (feed) => {
                const wtf = await parser.parseURL(feed.url);

                return { ...feed, wtf };
            }));
        }));
    }
};
