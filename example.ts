
import { loadTest } from './src';

loadTest({
  headers: {},
  totalReqs: 1000,
  method: 'GET',
  apiBase: 'google.com',
  path: '/',
  concurrentReqs: 100,
  rampUpTime: 0,
});
