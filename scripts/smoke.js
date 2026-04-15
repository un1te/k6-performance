/**
 * Smoke Test: Verify endpoints are up and responding
 * 1 VU for 1 minute — lightweight health check
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { handleSummary } from './utils.js';
import { ENDPOINTS, THRESHOLDS, POST_PAYLOAD, DEFAULT_HEADERS } from '../config.js';

export const options = {
  vus: 1,
  duration: '30s',
  thresholds: THRESHOLDS,
};

export function handleSummarySmoke(data) {
  return handleSummary('SMOKE', 'reports/smoke-report.html', data);
}

export { handleSummarySmoke as handleSummary };

export default function () {
  // Test GET /posts
  const getRes = http.get(ENDPOINTS.posts);

  check(getRes, {
    'GET /posts - status is 200': (r) => r.status === 200,
    'GET /posts - response contains posts array': (r) => {
      const body = JSON.parse(r.body);
      return Array.isArray(body) && body.length > 0;
    },
    'GET /posts - first post has required fields': (r) => {
      const body = JSON.parse(r.body);
      const firstPost = body[0];
      return firstPost.id && firstPost.userId && firstPost.title && firstPost.body;
    },
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
    'POST /posts - response echoes payload': (r) => {
      const body = JSON.parse(r.body);
      return body.userId === POST_PAYLOAD.userId &&
             body.title === POST_PAYLOAD.title &&
             body.body === POST_PAYLOAD.body;
    },
  });

  sleep(1);
}

