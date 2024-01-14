import { config } from 'dotenv';
  
config();

import Entrypoint from './plugins/entrypoint';

const entrypoint = new Entrypoint();

entrypoint.start();
