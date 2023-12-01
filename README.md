# API Load Testing

## Overview

This library provides a straightforward and efficient way to perform load testing on APIs using Node.js. It leverages the `radash` library for parallel execution of API requests, allowing developers to simulate heavy concurrent traffic and assess the API's performance under stress.

## Features

- **Concurrent Requests**: Easily configure the number of concurrent requests to simulate real-world scenarios.
  
- **Ramp-Up Time**: Specify a ramp-up time to gradually increase the load on the API, mimicking a more realistic usage pattern.

- **Performance Metrics**: The library captures and logs the maximum time taken for a single API request during the load test.

## Installation

```bash
npm install
```

## Usage
```ts
import { loadTest, IApiLoadTestConfig } from "your-load-test-library";

// Define the load test configuration
const loadTestConfig: IApiLoadTestConfig = {
  headers: {},
  totalReqs: 1000,
  method: 'GET',
  apiBase: 'google.com',
  path: '/',
  concurrentReqs: 100,
  rampUpTime: 0,
};

// Execute load test
await loadTest(loadTestConfig);
```

## Configuration
**apiBase**: The base URL of the target API.

**path**: The endpoint path to be tested.

**method**: HTTP method for the API requests (GET, POST, PUT, PATCH, DELETE).

**totalReqs**: Total number of API requests to be made during the load test.

**rampUpTime**: Time (in seconds) to gradually increase the load on the API.

**headers**: Optional headers to include in the API requests.

**concurrentReqs**: Number of concurrent requests to be executed simultaneously.

## Example
For a more detailed example, refer to the sample usage in the code comments or check the provided example.ts file.

### Example Usage in example.ts
```ts
/**
 * Example Usage of API Load Testing Library
 * 
 * This example demonstrates a basic usage of the API load testing library
 * by conducting a load test on the Google Search API endpoint.
 */

import { loadTest, IApiLoadTestConfig } from './src';

// Define the load test configuration
const loadTestConfig: IApiLoadTestConfig = {
  headers: {},
  totalReqs: 1000,
  method: 'GET',
  apiBase: 'google.com',
  path: '/',
  concurrentReqs: 100,
  rampUpTime: 0,
};

// Execute the load test with the specified configuration
loadTest(loadTestConfig)
  .then(() => {
    console.log('Load test completed successfully.');
  })
  .catch((error) => {
    console.error('Error during load test:', error);
  });

```
### In this example:

The loadTest function from the API load testing library is imported.

A configuration object (loadTestConfig) is created to define the parameters for the load test.

The loadTest function is called with the provided configuration, and promises are used for handling success or errors.

Console logs are added to indicate the completion of the load test or any encountered errors.

### License
This library is licensed under the MIT License - see the LICENSE.md file for details.

### Acknowledgments
Inspired by the need for a simple yet powerful API load testing solution.

Utilizes the radash library for efficient parallel execution.
