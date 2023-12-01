import { parallel } from "radash";
const https = require('https');

interface IRequestOptions {
  hostname: string;
  port: number;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  headers?: Record<string, string>,
}

export interface IApiLoadTestConfig {
  apiBase: string;
  path: string;
  headers?: IRequestOptions['headers'];
  concurrentReqs: number;
  totalReqs: number;
  rampUpTime: number; // in seconds
  method: IRequestOptions['method']
}


let MAX_TIME_FOR_REQUEST = 0;


/*
 * Creates an API request
 */
async function makeRequest(requestOptions: IRequestOptions) {
  return new Promise((resolve, reject) => {
    let data: {
      body: any[],
      reqTime: number,
    } = {
      body: [],
      reqTime: performance.now()
    }
    const req = https.request(requestOptions, (res: any) => {
      res.on('data', (chunk: any) => {
        data.body.push(chunk);
      });

      res.on('end', () => {
        data.reqTime = performance.now() - data.reqTime;
        console.log(data.reqTime);
        if (data.reqTime > MAX_TIME_FOR_REQUEST) {
          MAX_TIME_FOR_REQUEST = data.reqTime;
        }
        resolve(data)
      });
    }).on('error', (err: Error) => {
      reject(err);
    });
    req.end();
  })
}

/*
 * Creates an API request options for all requests
 */
function createRequestOptions(config: IApiLoadTestConfig) {
  const requests: IRequestOptions[] = [];
  for (let i = 0; i < config.totalReqs; i++) {
    requests.push({
      headers: {
        ...config.headers
      },
      hostname: config.apiBase,
      port: 443,
      path: config.path,
      method: 'GET',
    });
  }
  return requests;
}

/*
 * Sleeps for {time} seconds
 */
async function sleep(time: number) {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      resolve(true);
    }, time * 1000)
  })
}

/*
 * Uses radash.parallel to parallely execute requests
 */
async function parallelExecRequests(requestOptions: IRequestOptions[], concurrencyOpts: {
  concurrentReqs: number;
  rampUpTime: number;
}) {
  let requestBatch = 0;
  await parallel(concurrencyOpts.concurrentReqs, requestOptions, async (requestOption) => {
    requestBatch++;
    console.log('Staring to execute batch: ' + requestBatch)
    await makeRequest(requestOption);
    console.log('Finished executing batch: ' + requestBatch)
    await sleep(concurrencyOpts.rampUpTime);
  })
}

/* 
 * Load test the API end point.
 * Sample usage of the function:
 * await test({
 *  apiBase: 'https://api.example.com'
 *  path: '/',
 *  method: 'GET',
 *  totalReqs: 10000,
 *  rampUpTime: 5, (in seconds)
 *  headers: new Headers({
 *    Authorization: 'Bearer AUTHTOKEN_GOES_HERE',
 *    SomeApiRelavantHeader: SomeApiRelavantHeaderValue,
 *    concurrentReqs: 100,
 *  })
 * })
 */
export async function loadTest(config: IApiLoadTestConfig) {
  console.log('---- STARTING LOADTEST ----');
  const requestOptions = createRequestOptions(config);
  await parallelExecRequests(requestOptions, {
    concurrentReqs: config.concurrentReqs,
    rampUpTime: config.rampUpTime,
  });
  console.log('MAX TIME FOR REQUEST: ' + MAX_TIME_FOR_REQUEST);
  console.log('---- LOADTEST ENDED ----');
}
