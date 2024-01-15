const { MongoClient, ObjectId } = require('mongodb');

const client = new MongoClient(String(process.env.MONGO_URI), {
    // tls: true,
    // tlsCAFile: require('path').resolve(process.cwd(), './libs/mongodb.crt'),
});

export const database = client.db(String(process.env.MONGO_DATABASE));

export { ObjectId };

// export const User = database.collection('users');
// export const Board = database.collection('boards');
// export const CloudStorage = database.collection('cloud-storage');

// export const EmailSubmissions = database.collection('example101es');
// export const Views = database.collection('example101views');
export const Posts = database.collection('posts');

client.connect().catch((error) => {
    console.log(error);
    process.exit(1);
});
