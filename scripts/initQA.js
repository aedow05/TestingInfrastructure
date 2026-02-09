import fs from 'fs';
import inquirer from 'inquirer';

console.log("\n=== QA Monitor Setup Wizard ===\n");

const answers = await inquirer.prompt([
  {
    type: 'input',
    name: 'projectName',
    message: 'What is your project name?',
    default: 'My Web App'
  },
  {
    type: 'input',
    name: 'baseURL',
    message: 'What URL should QA test?',
    default: 'http://localhost:3000'
  },
  {
    type: 'confirm',
    name: 'hasLogin',
    message: 'Does the app have a login flow?',
    default: true
  },
  {
    type: 'confirm',
    name: 'useAI',
    message: 'Enable AI failure analysis (Groq)?',
    default: true
  }
]);

const config = {
  projectName: answers.projectName,
  baseURL: answers.baseURL,
  loginFlow: answers.hasLogin,
  aiAnalysis: answers.useAI
};

fs.writeFileSync('qa.config.json', JSON.stringify(config, null, 2));

console.log("\n✓ qa.config.json created!");
console.log("Next step: run 'npm run qa:check'\n");
