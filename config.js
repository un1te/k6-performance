/**
 * Shared configuration for k6 performance tests
 * Centralized constants: URLs, thresholds, payloads
 */

export const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const ENDPOINTS = {
  posts: `${BASE_URL}/posts`,
};

export const THRESHOLDS = {
  'http_req_duration': ['p(95)<400'],
  'http_req_failed': ['rate<0.01'],
};

export const POST_PAYLOAD = {
  userId: '2',
  title: 'Test title',
  body: 'btets body',
  id: '55',
};

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};
