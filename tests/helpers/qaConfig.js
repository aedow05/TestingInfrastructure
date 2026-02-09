import fs from 'fs';

export function loadQAConfig() {
  try {
    const raw = fs.readFileSync('qa.config.json', 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(
      "qa.config.json not found. Run: npm run qa:init before running tests."
    );
  }
}
