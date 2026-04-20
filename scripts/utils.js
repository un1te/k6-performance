import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

/**
 * Generate HTML report and console summary for any test
 * @param {string} testName - Name of the test (e.g., "SMOKE", "LOAD", "STRESS")
 * @param {string} reportPath - Output path for HTML report (e.g., "reports/smoke-report.html")
 * @param {object} data - k6 summary data object
 * @returns {object} Summary output configuration for k6
 */
export function handleSummary(testName, reportPath, data) {
  return {
    [reportPath]: htmlReport(data),
    stdout: textSummary(testName, data),
  };
}

/**
 * Format console output with test results and report location
 * @param {string} testName - Test name for display
 * @param {object} data - k6 summary data with metrics
 * @returns {string} Formatted console output
 */
export function textSummary(testName, data) {
  const metrics = data.metrics;
  const summary = [];

  summary.push('\n');
  summary.push('═══════════════════════════════════════════════════════════');
  summary.push(`✓ ${testName} TEST COMPLETED`);
  summary.push('═══════════════════════════════════════════════════════════');
  summary.push(`\nTotal Requests: ${metrics.http_reqs.values.count}`);
  summary.push(`Failed Requests: ${(metrics.http_req_failed.values.rate * 100).toFixed(2)}%`);
  summary.push(`Avg Response Time: ${metrics.http_req_duration.values.avg.toFixed(2)}ms`);

  // Include p95 if available (not in smoke test typically)
  if (metrics.http_req_duration.values['p(95)']) {
    summary.push(`p95 Response Time: ${metrics.http_req_duration.values['p(95)'].toFixed(2)}ms`);
  }

  const reportFile = getReportFileName(testName);
  summary.push(`\n📊 HTML Report Generated:`);
  summary.push(`   ${reportFile}`);
  summary.push('\n   Open the report in your browser to view detailed metrics,');
  summary.push('   charts, and performance analysis.');
  summary.push('\n═══════════════════════════════════════════════════════════\n');

  return summary.join('\n');
}

/**
 * Get the report file path based on test name
 * @param {string} testName - Test type (SMOKE, LOAD, STRESS)
 * @returns {string} Report file path
 */
function getReportFileName(testName) {
  const reportMap = {
    'SMOKE': 'reports/smoke-report.html',
    'LOAD': 'reports/load-report.html',
    'STRESS': 'reports/stress-report.html',
  };
  return reportMap[testName] || 'reports/report.html';
}
