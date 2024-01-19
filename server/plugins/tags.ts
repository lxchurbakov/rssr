import { HttpError, route } from '/libs/utils';
import { ObjectId, Tags } from '/libs/mongo';

import Entrypoint from './entrypoint';

const TAGS_LIST_COUNT = 5;

export default class {
    constructor (private entrypoint: Entrypoint) {
        this.entrypoint.app.post('/tags', route(async (req, res) => {
            const name = req.body.name;

            if (!name) {
                throw new HttpError(400, 'invalid_name');
            }

            const { insertedId } = await Tags.insertOne({ name });

            if (!insertedId) {
                throw new HttpError(500, 'cannot_create_tag');
            }

            return insertedId;
        }));

        this.entrypoint.app.get('/tags', route(async (req, res) => {
            const query = req.query.query;

            // starts with query
            return Tags.find({ name: { $regex: '^' + query } }).limit(TAGS_LIST_COUNT).toArray();
        }));

        this.entrypoint.app.delete('/tags/:tagId', route(async (req, res) => {
            const tagId = req.params.tagId;
            const { deletedCount } = await Tags.deleteOne({ _id: new ObjectId(tagId) });

            if (deletedCount === 0) {
                throw new HttpError(404, 'tag_not_found');
            }

            return null;
        }));
    }
};
