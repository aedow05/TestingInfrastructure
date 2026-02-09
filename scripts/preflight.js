import fs from 'fs';
import fetch from 'node-fetch';
import { execSync } from 'child_process';

console.log("\n=== QA Preflight Checks ===\n");

/* ---------------- CONFIG CHECK ---------------- */

if (!fs.existsSync('qa.config.json')) {
  console.error("✗ qa.config.json missing.");
  console.log("Run: npm run qa:init");
  process.exit(1);
}

console.log("✓ Config file found");

/* ---------------- LOAD CONFIG ---------------- */

const config = JSON.parse(fs.readFileSync('qa.config.json', 'utf8'));

/* ---------------- SITE CHECK ---------------- */

/* ---------------- SITE CHECK ---------------- */

async function waitForServer(url, retries = 10) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {}
    await new Promise(r => setTimeout(r, 1000));
  }
  return false;
}

// If testing localhost, try to start demo app automatically
if (config.baseURL.includes('localhost')) {
  console.log("Local app detected — starting demo server...");

  try {
    execSync('npm run start-app', { stdio: 'ignore', timeout: 3000 });
  } catch {}

  const ready = await waitForServer(config.baseURL);

  if (!ready) {
    console.error(`✗ Could not start local app at ${config.baseURL}`);
    process.exit(1);
  }

  console.log(`✓ Local app running at ${config.baseURL}`);

} else {
  // Remote site — just check reachability
  try {
    const res = await fetch(config.baseURL);
    if (!res.ok) throw new Error();
    console.log(`✓ Remote site reachable at ${config.baseURL}`);
  } catch {
    console.error(`✗ Cannot reach remote site at ${config.baseURL}`);
    process.exit(1);
  }
}


/* ---------------- PLAYWRIGHT CHECK ---------------- */

try {
  execSync('npx playwright --version', { stdio: 'ignore' });
  console.log("✓ Playwright installed");
} catch {
  console.error("✗ Playwright not installed correctly.");
  console.log("Run: npx playwright install");
  process.exit(1);
}

/* ---------------- AI CHECK ---------------- */

if (!process.env.GROQ_API_KEY) {
  console.log("⚠ No GROQ_API_KEY detected — AI analysis will be skipped");
} else {
  console.log("✓ Groq AI configured");
}

console.log("\nAll checks passed. You can now run QA.\n");
