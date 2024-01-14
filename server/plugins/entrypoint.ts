import express from 'express';

// The very first basic plugin that creates an express sever
// and provides a way for other plugins to expose API endpoints

const ALLOW_ORIGIN = '*'; // TODO to be changed once we go production
const PORT = Number(process.env.PORT);

if (!PORT) {
    throw new Error(`Cannot start application, PORT is not defined`);
}

export default class {
    public app: express.Application;
    public server: express.Server;

    constructor() {
        this.app = express();

        //
        // Here we turn off CORS checks at all (needs to be changed)
        // before going production and enable application/json format
        //

        this.app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', ALLOW_ORIGIN);
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept, authorization');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE');
            res.setHeader('Access-Control-Allow-Credentials', 'true');

            if (req.method === 'OPTIONS') {
                res.sendStatus(200);
            } else {
                next();
            }
        });

        this.app.use(express.json());
    }

    // Main method for this plugin (to be executed later
    // after all the other plugins expose their endpoints)

    public start = () => {
        // An error processing function that expect
        // an object of special type - HttpError to 
        // be thrown and gets status code from that
        this.app.use((err, req, res, next) => {
            if (!!err.statusCode) {
                res.status(err.statusCode).json(err.body || null);
            } else {
                res.status(500).send(err.toString());
            }
        });

        this.server = this.app.listen(PORT, () => {
            console.log(`Server is up at ${PORT}`);
        });
    };
};
