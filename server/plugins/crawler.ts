import axios from 'axios';
import crypto from 'crypto';
import { CronJob } from 'cron';
import Parser from 'rss-parser';

import { route } from '/libs/utils';
import { ObjectId } from '/libs/mongo';

import Entrypoint from './entrypoint';
import Posts from './posts';

const parser = new Parser();

const FEEDS_SOURCE = {
    gistId: '5e855f20a70d09e60e25431265666162',
    versionId: 'cade6bcf2d9ee7580a6fb7249e81ae60b8910062',
    filename: 'feeds.json',
};

const fetchGist = async (gistId: string, versionId: string, filename: string) => {
    const { data } =  await axios.get(
        `https://gist.githubusercontent.com/lxchurbakov/${gistId}/raw/${versionId}/${filename}`
    );

    return data;
};  

export type FeedItem = {
    title: string;
    pubDate: string;
    link: string;
    content: string;
};

export type Feed = {
    items: FeedItem[];
    image: string;
    feedUrl: string;
    paginationLinks: any;
    title: string;
    description: string;
    language: any;
};

export default class {
    private job: CronJob;

    constructor (private entrypoint: Entrypoint, private posts: Posts) {
        // First thing we create a job to fetch the 
        // feeds and store the posts in database
        this.job = new CronJob(
            '* * * * * *', // cronTime '0 0-23/4 * * *'
            this.fetchPosts.bind(this), // onTick
            null, // onComplete
            true, // start
            'America/Los_Angeles' // timeZone
        );

        // We also run this process once on a startup 
        // just in case
        this.fetchPosts();

        
        // this.entrypoint.app.get('/feeds', route(async (req, res) => {
        //     const feeds = await fetchGist(
        //         FEEDS_SOURCE.gistId,
        //         FEEDS_SOURCE.versionId,
        //         FEEDS_SOURCE.filename,
        //     );

        //     return Promise.all(feeds.map(async (feed) => {
        //         const wtf = await parser.parseURL(feed.url);

        //         return { ...feed, wtf };
        //     }));
        // }));
    }

    private fetchPosts = async () => {
        const feeds = await fetchGist(
            FEEDS_SOURCE.gistId,
            FEEDS_SOURCE.versionId,
            FEEDS_SOURCE.filename,
        ) as { url: string }[];

        await Promise.all(feeds.map(async (feed) => {
            const { items } = await parser.parseURL(feed.url);

            await Promise.all(items.map(async (item: FeedItem) => {
                const { title, pubDate, link, content } = item;

                await this.posts.add({ title, pubDate: new Date(pubDate), link, preview: content });
            }));
        }));
    };
};
