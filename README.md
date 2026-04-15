# k6 Performance Testing 

A production-ready performance testing suite built with [k6](https://k6.io/) (Grafana k6) demonstrating real-world load, stress, and smoke testing patterns. 

---

## 🎯 Project Overview

This repository demonstrates  performance testing practices using k6 against a public REST API (`jsonplaceholder.typicode.com`). The suite includes three distinct test types, each designed to reveal different aspects of system behavior under varying load conditions.

### Key Features

- **Modular Architecture**: Separated concerns for config, test logic, and data
- **Smoke Testing**: Quick endpoint health checks (1 VU × 30 minute)
- **Load Testing**: Realistic traffic simulation (ramp to 50 VUs over 2 minutes)
- **Stress Testing**: Breaking point identification (ramp to 300 VUs over 2.5 minutes)
- **HTML Reporting**: k6-reporter integration for visual result analysis
- **Shared Configuration**: Single source of truth for URLs, thresholds, and payloads
- **Comprehensive Assertions**: Status code validation, response structure checks, and performance thresholds

---

## 🎪 Objectives

1. **Verify Endpoint Health**: Confirm APIs respond to both GET and POST requests with correct status codes
2. **Test Under Expected Load**: Simulate typical production traffic patterns and measure response times
3. **Identify Breaking Points**: Stress the system to discover performance degradation and failure thresholds
4. **Validate Data Integrity**: Ensure responses match expected structure and payload echoing
5. **Demonstrate QA Expertise**: Showcase production-grade test design, execution, and reporting

---

## 🚀 Installation

### 1. Install k6
Follow the official installation guide for your operating system: https://k6.io/docs/getting-started/installation

### 2. Clone / Set Up Repository

```bash
# If using git
git clone <repository-url>
cd k6

# Or navigate to the project directory
cd /path/to/k6
```

### 3. (Optional) Install Node Dependencies

If you want to use npm scripts:

```bash
npm install
# Note: package.json is primarily for documentation; k6 is a standalone binary
```

---

## 📁 Project Structure

```
k6/
├── config.js                 # Shared constants: URLs, thresholds, payloads
├── package.json              # npm scripts and metadata
├── README.md                 # This file
│
├── scripts/
│   ├── smoke.js              # 1 VU × 1 min — endpoint health check
│   ├── load.js               # Ramp to 50 VUs — typical traffic simulation
│   ├── stress.js             # Ramp to 300 VUs — breaking point test
│   └── utils.js              # Shared utility functions (reporting, summaries)
│
└── reports/
    ├── .gitkeep              # Placeholder directory
    ├── smoke-report.html     # Generated after smoke test run
    ├── load-report.html      # Generated after load test run
    └── stress-report.html    # Generated after stress test run
```

### Configuration Files

**config.js**: Central configuration hub
- `BASE_URL`: Target API base URL (`https://jsonplaceholder.typicode.com`)
- `ENDPOINTS`: API endpoint paths
- `THRESHOLDS`: Performance criteria (p95 response time, error rate)
- `POST_PAYLOAD`: Request body for POST operations
- `DEFAULT_HEADERS`: HTTP headers for all requests

---

## 🏃 Running Tests

### Option 1: Using npm Scripts (Recommended)

```bash
# Run smoke test
npm run smoke

# Run load test
npm run load

# Run stress test
npm run stress
```

### Option 2: Direct k6 Commands

```bash
# Run smoke test
k6 run scripts/smoke.js

# Run load test
k6 run scripts/load.js

# Run stress test
k6 run scripts/stress.js

# Run with custom options
k6 run --vus 10 --duration 30s scripts/smoke.js

# Output results in JSON format
k6 run --out json=reports/results.json scripts/smoke.js
```

### Test Execution Output

After each test completes, you'll see:
1. **Console Summary** — Key metrics printed to terminal with report location
2. **HTML Report** — Automatically generated and saved to `reports/` directory

---

## 📊 Performance Metrics Explained

### Core Metrics

| Metric | Definition | Target / Acceptable Range |
|--------|-----------|---------------------------|
| **VU** (Virtual User) | Simulated concurrent user executing the test scenario | Varies: 1 (smoke) → 50 (load) → 300 (stress) |
| **Iterations** | Complete execution of the default function | Target: High count with low failure rate |
| **http_reqs** | Total HTTP requests sent during test | Indicates throughput; higher = more load |
| **http_req_duration** | Total time for HTTP request (incl. all phases) | Smoke/Load: <500ms (p95) |
| **p95 (95th percentile)** | Response time for 95% of requests | <500ms for smoke/load tests |
| **Error Rate** | Percentage of failed requests | <1% for smoke/load, <5% for stress |
| **Throughput** | Requests per second (RPS) | Depends on target API; analyze trends |

### Request Lifecycle Phases

k6 breaks down request duration into phases:
- **blocked**: Time waiting for network connection slot
- **connecting**: TCP connection establishment
- **tls_handshaking**: HTTPS/TLS negotiation
- **sending**: Time to send request body
- **waiting**: Server processing time (most critical)
- **receiving**: Time to receive response body


---

---


## 🔍 Debugging & Troubleshooting

### Test Fails with Status Error
Check the target endpoint:
```bash
curl -v https://jsonplaceholder.typicode.com/posts
```

### Reports Not Generated
Ensure `reports/` directory exists and is writable:
```bash
ls -la reports/
chmod 755 reports/
```
## 👤 Author

Senior QA Engineer Rashchupkin Kostiantin

---

**Happy Load Testing! 🚀**