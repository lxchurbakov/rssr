import { config } from 'dotenv';
  
config();

import Entrypoint from './plugins/entrypoint';

import Tags from './plugins/tags';
import Posts from './plugins/posts';

import Crawler from './plugins/crawler';

const entrypoint = new Entrypoint();

const tags = new Tags(entrypoint);
const posts = new Posts(entrypoint);

const feeds = new Crawler(entrypoint, posts);

entrypoint.start();
