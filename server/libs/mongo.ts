const { MongoClient, ObjectId } = require('mongodb');

const client = new MongoClient(String(process.env.MONGO_URI), {
    // tls: true,
    // tlsCAFile: require('path').resolve(process.cwd(), './libs/mongodb.crt'),
});

export const database = client.db(String(process.env.MONGO_DATABASE));

export { ObjectId };

export const Posts = database.collection('posts');
export const Tags = database.collection('tags');
export const TagsToPosts = database.collection('tags2posts');

client.connect().catch((error) => {
    console.log(error);
    process.exit(1);
});
