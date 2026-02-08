import fs from 'fs';

const results = JSON.parse(fs.readFileSync('test-results.json', 'utf8'));
const historyFile = 'qa-history/results.json';

let history = [];

if (fs.existsSync(historyFile)) {
    history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
}

history.push({
    date: new Date().toISOString(),
    stats: results.stats,
    suites: results.suites
});

fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));

console.log("QA history updated.");
