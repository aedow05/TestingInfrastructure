import 'dotenv/config';
import fs from 'fs';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const results = JSON.parse(fs.readFileSync('test-results.json', 'utf8'));

let failures = [];

results.suites.forEach(suite => {
  suite.specs.forEach(spec => {
    spec.tests.forEach(test => {
      const result = test.results[0];

      if (result.status !== 'passed') {
        failures.push({
          test: test.title,
          error: result.error?.message || "Unknown error"
        });
      }
    });
  });
});

async function analyze() {

  if (failures.length === 0) {
    fs.writeFileSync("AI_ANALYSIS.md", "No failures detected.");
    return;
  }

  const prompt = `
You are a senior SDET engineer.

Explain these Playwright failures in plain English.
Include:
- likely root cause
- whether flaky
- suggested fix

Failures:
${JSON.stringify(failures, null, 2)}
`;

  const response = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama3-70b-8192"
  });

  fs.writeFileSync("AI_ANALYSIS.md", response.choices[0].message.content);
}

analyze();
