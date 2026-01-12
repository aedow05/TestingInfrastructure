import fs from "fs";

const RESULTS_PATH = "test-results/results.json";

function detectGroup(errorMessage) {
  const msg = errorMessage.toLowerCase();

  // ✅ Connection refused patterns across browsers
  if (
    msg.includes("err_connection_refused") ||
    msg.includes("ns_error_connection_refused") ||
    msg.includes("could not connect to server") ||
    msg.includes("connection refused") ||
    msg.includes("net::")
  ) {
    return "App/Server Not Running";
  }

  if (msg.includes("timeout") || msg.includes("timed out"))
    return "Timing / Flaky";

  if (
    (msg.includes("locator") && msg.includes("not found")) ||
    msg.includes("strict mode violation")
  )
    return "Selector/UI Changed";

  if (msg.includes("expect") || msg.includes("received"))
    return "Functional Assertion Failure";

  return "Other / Needs Investigation";
}


// Load JSON
if (!fs.existsSync(RESULTS_PATH)) {
  console.log(`❌ Could not find ${RESULTS_PATH}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(RESULTS_PATH, "utf8"));

const groups = {};

function addToGroup(group, item) {
  groups[group] ??= [];
  groups[group].push(item);
}

function walkSuites(suites) {
  for (const suite of suites || []) {
    // nested suites possible
    walkSuites(suite.suites);

    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        for (const result of test.results || []) {
          if (result.status === "failed") {
            const fullError = result.error?.message || "Unknown error";
            const firstLine = fullError.split("\n")[0];
            const group = detectGroup(fullError);

            addToGroup(group, {
              testTitle: spec.title,
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

// Output
console.log("FAILURE GROUPS");
console.log("=========================\n");

for (const [group, failures] of Object.entries(groups)) {
  console.log(`\n## ${group} (${failures.length})`);
  for (const f of failures) {
    console.log(`- ${f.file} :: ${f.testTitle}`);
    console.log(`  ↳ ${f.error}`);
  }
}

if (Object.keys(groups).length === 0) {
  console.log(" No failures found!");
}
