/**
 * Load Test: Simulate typical production traffic
 * Ramps up to 50 VUs to test system under expected load
 * Stages: 0→10 (1m) → 50 (3m) → 0 (1m)
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { handleSummary } from './utils.js';
import { ENDPOINTS, THRESHOLDS, POST_PAYLOAD, DEFAULT_HEADERS } from '../config.js';

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Ramp up from 0 to 10 VUs
    { duration: '1m', target: 50 },   // Ramp up to 50 VUs (sustain load)
    { duration: '30s', target: 0 },    // Ramp down to 0 VUs
  ],
  thresholds: THRESHOLDS,
};

export function handleSummaryLoad(data) {
  return handleSummary('LOAD', 'reports/load-report.html', data);
}

export { handleSummaryLoad as handleSummary };

export default function () {
  // Test GET /posts
  const getRes = http.get(ENDPOINTS.posts);

  check(getRes, {
    'GET /posts - status is 200': (r) => r.status === 200,
    'GET /posts - response contains posts array': (r) => {
      const body = JSON.parse(r.body);
      return Array.isArray(body) && body.length > 0;
    },
    'GET /posts - response time acceptable': (r) => r.timings.duration < 1000,
  });

  sleep(1);

  // Test POST /posts
  const postRes = http.post(ENDPOINTS.posts, JSON.stringify(POST_PAYLOAD), {
    headers: DEFAULT_HEADERS,
  });

  check(postRes, {
    'POST /posts - status is 201': (r) => r.status === 201,
    'POST /posts - response has id': (r) => {
      const body = JSON.parse(r.body);
      return body.id !== undefined && body.id !== null;
    },
    'POST /posts - response time acceptable': (r) => r.timings.duration < 1000,
  });

  sleep(1);
}

