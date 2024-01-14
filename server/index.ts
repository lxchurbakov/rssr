import { config } from 'dotenv';
  
config();

import Entrypoint from './plugins/entrypoint';
import Feeds from './plugins/feeds';

const entrypoint = new Entrypoint();
const test = new Feeds(entrypoint);

entrypoint.start();
