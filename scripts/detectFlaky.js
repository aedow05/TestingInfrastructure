import fs from 'fs';

const history = JSON.parse(fs.readFileSync('qa-history/results.json', 'utf8'));

const tests = {};

history.forEach(run => {
  run.suites.forEach(suite => {
    suite.specs.forEach(spec => {
      spec.tests.forEach(test => {

        const name = test.title;
        const status = test.results[0].status;

        if (!tests[name]) tests[name] = [];

        tests[name].push(status);
      });
    });
  });
});

let report = "## Flaky Test Report\n\n";

Object.keys(tests).forEach(test => {
  const unique = [...new Set(tests[test])];

  if (unique.length > 1) {
    report += `FLAKY: ${test}\nHistory: ${tests[test].join(", ")}\n\n`;
  }
});

fs.writeFileSync("FLAKY_REPORT.md", report);

console.log("Flaky analysis complete.");

