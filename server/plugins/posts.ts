
import Entrypoint from './entrypoint';
import { HttpError, route } from '/libs/utils';
import { ObjectId, Posts } from '/libs/mongo';
import { Entity } from '/libs/types';

export type PostDraft = {
    title: string;
    preview: string;
    pubDate: Date;
    link: string;
};

export type Post = Entity<PostDraft>;

export default class {
    constructor (private entrypoint: Entrypoint) {
        // List posts
        this.entrypoint.app.get('/posts', route(async (req, res) => {
            const query = String(req.query.query);
            const page = Number(req.query.page);
            const sort = String(req.query.sort);
            const sortDir = String(req.query.sortDir);
            const tags = Array.from(req.query.tags || []);

            const start = process.hrtime();

            const filter = {
                $and: [
                    {
                        $or: [
                            { title: { $regex: query, $options: 'i' } },
                            { content: { $regex: query, $options: 'i' } },
                        ],
                    },
                    (tags.length > 0 ? {
                        tags: {
                            $all: tags,
                        }
                    } : {}),
                ],
            };

            const count = await Posts.count(filter);
            const data =  await Posts.find(filter)
                .sort({ [sort]: sortDir }).limit(10).skip(page * 10).toArray();

            const time = process.hrtime(start)[1];

            return { count, data, time };
        }));

        // Get tags
        this.entrypoint.app.get('/posts/:postId/tags', route(async (req) => {
            return Posts.findOne({ _id: new ObjectId(req.params.postId) }, { tags: 1 }).then(({ tags }) => Array.isArray(tags) ? tags : []);
        }));

        // Increment views count
        this.entrypoint.app.post('/posts/:postId/view', route(async (req, res) => {
            return await Posts.updateOne({ _id: new ObjectId(req.params.postId) }, { $inc: { views: 1 } });
        }));

        // Attach post to tag (just name)
        this.entrypoint.app.post('/posts/:postId/tags/attach', route(async (req, res) => {
            const postId = req.params.postId;
            const name = req.body.name;

            const { updatedCount } = Posts.updateOne({ _id: new ObjectId(postId) }, { $push: { tags: name } });

            if (updatedCount === 0) {
                throw new HttpError(404, 'post_not_found');
            }
    
            return null;
        }));

        // Attach post to tag (just name)
        this.entrypoint.app.post('/posts/:postId/tags/detach', route(async (req, res) => {
            const postId = req.params.postId;
            const name = req.body.name;

            const { updatedCount } = Posts.updateOne({ _id: new ObjectId(postId) }, { $pull: { tags: name } });

            if (updatedCount === 0) {
                throw new HttpError(404, 'post_not_found');
            }
    
            return null;
        }));
    }

    public add = async (data: PostDraft) => {
        const link = data.link;
        const hash = link; // no md5 for now
        
        const post = await Posts.findOne({ hash });

        if (!post) {
            const { insertedId } = await Posts.insertOne({ ...data, hash });

            console.log(`Added post "${data.title}" / ${insertedId}`);
        }
    };
};
