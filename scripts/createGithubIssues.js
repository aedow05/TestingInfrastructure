import fs from "fs";
import { execSync } from "child_process";

const RESULTS_PATH = "test-results/results.json";

// 1) Group detector
function detectGroup(errorMessage) {
  const msg = errorMessage.toLowerCase();

  if (
    msg.includes("err_connection_refused") ||
    msg.includes("ns_error_connection_refused") ||
    msg.includes("could not connect to server") ||
    msg.includes("connection refused") ||
    msg.includes("net::")
  ) return "App/Server Not Running";

  if (msg.includes("timeout") || msg.includes("timed out"))
    return "Timing / Flaky";

  if (
    (msg.includes("locator") && msg.includes("not found")) ||
    msg.includes("strict mode violation")
  ) return "Selector/UI Changed";

  if (msg.includes("expect") || msg.includes("received"))
    return "Functional Assertion Failure";

  return "Other / Needs Investigation";
}

// 2) Load results.json
if (!fs.existsSync(RESULTS_PATH)) {
  console.log(` Cannot find: ${RESULTS_PATH}`);
  console.log("Run tests first: npm test");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(RESULTS_PATH, "utf8"));

// 3) Extract failures
const groups = {};

function add(group, item) {
  groups[group] ??= [];
  groups[group].push(item);
}

function walkSuites(suites) {
  for (const suite of suites || []) {
    walkSuites(suite.suites);
    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        for (const result of test.results || []) {
          if (result.status === "failed") {
            const fullError = result.error?.message || "Unknown error";
            const firstLine = fullError.split("\n")[0];
            const group = detectGroup(fullError);

            add(group, {
              title: spec.title,
              file: spec.file,
              error: firstLine,
            });
          }
        }
      }
    }
  }
}
walkSuites(data.suites);

// 4) Create GitHub issues
const repo = execSync("gh repo view --json nameWithOwner -q .nameWithOwner").toString().trim();

console.log(` Repo: ${repo}`);
console.log("Creating GitHub issues from grouped failures...\n");

for (const [group, failures] of Object.entries(groups)) {
  const issueTitle = `[Bug] ${group} (${failures.length} failing tests)`;

  const body =
`## Summary
Automated Playwright tests failed in the category: **${group}**

## Failed Tests (${failures.length})
${failures.map(f =>
`- \`${f.file}\` — **${f.title}**
  - Error: ${f.error}`
).join("\n")}

## Steps to Reproduce
1. Run: \`npm test\`
2. Open Playwright report: \`npm run test:report\`
3. See failing tests + artifacts

## Evidence
- JSON Results: \`${RESULTS_PATH}\`
- HTML Report: \`playwright-report/index.html\`

## Expected
Tests should run without failures.

## Actual
Failures occur in category: **${group}**
`;

  // labels based on group
  let labels = "bug,qa";
  if (group.includes("Server")) labels += ",environment";
  if (group.includes("Selector")) labels += ",ui";
  if (group.includes("Timing")) labels += ",flaky";

  const cmd = `gh issue create --title "${issueTitle}" --body "${body.replace(/"/g, '\\"')}" --label "${labels}"`;

  try {
    const out = execSync(cmd, { stdio: "pipe" }).toString().trim();
    console.log(`✅ Created issue: ${issueTitle}`);
    console.log(`   ${out}\n`);
  } catch (err) {
    console.log(`❌ Failed to create issue for group: ${group}`);
    console.log(err?.message || err);
  }
}

if (Object.keys(groups).length === 0) {
  console.log("🎉 No failures found, so no issues created.");
}
