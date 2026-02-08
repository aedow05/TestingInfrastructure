import fs from 'fs';

const history = JSON.parse(fs.readFileSync('qa-history/results.json', 'utf8'));

let totalRuns = history.length;
let totalFailures = 0;
let totalTests = 0;

history.forEach(run => {
  totalFailures += run.stats.unexpected;
  totalTests += run.stats.expected + run.stats.unexpected;
});

const passRate = ((totalTests - totalFailures) / totalTests * 100).toFixed(2);

const report = `
# QA Health Report

Total Runs: ${totalRuns}
Total Tests Executed: ${totalTests}
Total Failures: ${totalFailures}
Pass Rate: ${passRate}%

Generated: ${new Date().toLocaleString()}
`;

fs.writeFileSync('QA_REPORT.md', report);
console.log("QA report generated.");
