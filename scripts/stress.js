/**
 * Stress Test: Find system breaking point
 * Ramps up to 300+ VUs to identify performance degradation
 * Stages: 0→100 (2m) → 200 (5m) → 300 (2m) → 0 (1m)
 * Thresholds relaxed to allow system to fail gracefully
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { handleSummary } from './utils.js';
import { ENDPOINTS, POST_PAYLOAD, DEFAULT_HEADERS } from '../config.js';

export const options = {
  stages: [
    { duration: '30s', target: 100 },  // Ramp up to 100 VUs
    { duration: '1m', target: 200 },  // Increase to 200 VUs (sustain heavy load)
    { duration: '30s', target: 300 },  // Push to 300 VUs (breaking point test)
    { duration: '30s', target: 0 },    // Ramp down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<2000'], // Relaxed: allow slower responses under stress
    'http_req_failed': ['rate<0.05'],    // Relaxed: allow up to 5% failures under extreme load
  },
};

export function handleSummaryStress(data) {
  return handleSummary('STRESS', 'reports/stress-report.html', data);
}

export { handleSummaryStress as handleSummary };

export default function () {
  // Test GET /posts
  const getRes = http.get(ENDPOINTS.posts);

  check(getRes, {
    'GET /posts - status is 200': (r) => r.status === 200,
    'GET /posts - response is valid': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body);
      } catch {
        return false;
      }
    },
  });

  sleep(1);

  // Test POST /posts
  const postRes = http.post(ENDPOINTS.posts, JSON.stringify(POST_PAYLOAD), {
    headers: DEFAULT_HEADERS,
  });

  check(postRes, {
    'POST /posts - status is 201': (r) => r.status === 201,
    'POST /posts - response is valid': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.id !== undefined;
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}

