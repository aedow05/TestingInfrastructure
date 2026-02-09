import { execSync } from 'child_process';

console.log("\n=== AI Continuous QA Monitor Demo ===\n");

try {

  // 1) Safety checks
  console.log("Running preflight checks...\n");
  execSync('node scripts/preflight.js', { stdio: 'inherit' });

  // 2) Run Playwright tests
  console.log("\nRunning automated tests...\n");
  execSync('npx playwright test', { stdio: 'inherit' });

  // 3) Save history
  console.log("\nSaving test history...\n");
  execSync('node scripts/saveResults.js', { stdio: 'inherit' });

  // 4) Flaky detection
  console.log("\nAnalyzing stability...\n");
  execSync('node scripts/detectFlaky.js', { stdio: 'inherit' });

  // 5) QA report
  console.log("\nGenerating QA report...\n");
  execSync('node scripts/generateReport.js', { stdio: 'inherit' });

  // 6) AI analysis
  console.log("\nRunning AI failure analysis...\n");
  execSync('node scripts/aiAnalyze.js', { stdio: 'inherit' });

  console.log("\n=== Demo Complete ===\n");
  console.log("Open these files:");
  console.log("QA_REPORT.md");
  console.log("AI_ANALYSIS.md");
  console.log("FLAKY_REPORT.md\n");

} catch (err) {
  console.error("\nDemo failed. Read the error above.\n");
  process.exit(1);
}
