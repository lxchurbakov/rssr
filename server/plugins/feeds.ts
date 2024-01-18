import axios from 'axios';
import crypto from 'crypto';
import { CronJob } from 'cron';
import Parser from 'rss-parser';

import { route } from '/libs/utils';
import { ObjectId, Posts } from '/libs/mongo';

import Entrypoint from './entrypoint';

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

const getHash = (data) => {
    return crypto.pbkdf2Sync(data, '', 1, 512, 'md5').toString('hex');
};

export default class {
    private job: CronJob;

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

        // this.job = new CronJob(
        //     '* * * * * *', // cronTime '0 0-23/4 * * *'
        //     this.fetchPosts.bind(this), // onTick
        //     null, // onComplete
        //     true, // start
        //     'America/Los_Angeles' // timeZone
        // );

        this.fetchPosts();

        this.entrypoint.app.get('/posts', route(async (req, res) => {
            const query = String(req.query.query);
            const page = Number(req.query.page);
            const sort = String(req.query.sort);
            const sortDir = String(req.query.sortDir);

            const start = process.hrtime();

            const filter = {
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { content: { $regex: query, $options: 'i' } },
                ]
            };

            const count = await Posts.count(filter);
            const data =  await Posts.find(filter).sort({ [sort]: sortDir }).limit(10).skip(page * 10).toArray();

            return { count, data, time: process.hrtime(start)[1] };
        }));

        this.entrypoint.app.post('/posts/:postId/view', route(async (req, res) => {
            // 
            return await Posts.updateOne({ _id: new ObjectId(req.params.postId) }, { $inc: { views: 1 } });
        }));
    }

    private addPost = async (data) => {
        const hash = getHash(JSON.stringify(data));
        const post = await Posts.findOne({ hash });

        if (!post) {
            const { insertedId } = await Posts.insertOne({ ...data, hash });

            console.log(`Added post "${data.title}" / ${insertedId}`);
        }
    };

    private fetchPosts = async () => {
        const feeds = await fetchGist(
            FEEDS_SOURCE.gistId,
            FEEDS_SOURCE.versionId,
            FEEDS_SOURCE.filename,
        );

        await Promise.all(feeds.map(async (feed) => {
            const { items, image, feedUrl, paginationLinks, title, description, language } = await parser.parseURL(feed.url);

            await Promise.all(items.map(async (item) => {
                // const { title, link, pubDate, 'content:encoded': content, } = item;
                const { title, pubDate, link, content } = item as any;

                await this.addPost({ title, pubDate: new Date(pubDate), link, content });
            }));
        }));
    };
};
