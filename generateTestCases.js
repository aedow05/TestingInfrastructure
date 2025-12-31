import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import fs from "fs";

const llm = new ChatGroq({
  model: "llama-3.1-8b-instant",
  temperature: 0,
  apiKey: process.env.GROQ_API_KEY
});


const template = `
Create a QA test case using this structure:
Return only json in the following format:

You are a QA engineer. Generate a STRICT JSON test case.
Return ONLY valid JSON. No markdown. No text. No extra characters.

The JSON MUST contain these fields:
- id (string)
- persona (string)
- description (string)
- preconditions (array of strings)
- steps (array of strings)
- expectedResults (array of strings)
- createdAt (ISO timestamp)
- source (string = "Groq-AI")
- flow (string)

Persona: {persona}
User Flow: {flow}
`;

const prompt = new PromptTemplate({
  template,
  inputVariables: ["persona", "flow"]
});

async function generateTestCase(persona, flow) {
  const finalPrompt = await prompt.format({ persona, flow });

  const response = await llm.invoke(finalPrompt);

  console.log("GENERATED TEST CASE");
  
  // convert response to json
  let content = response.content.trim();
  if (content.startsWith('```json')) {
    content = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  }
  const testcase = JSON.parse(content);

  //load the existing test cases
  const path = "./data/testcases.json"
  let existing = [];

  if (fs.existsSync(path)) {
    const file = fs.readFileSync(path, "utf8");
    existing = JSON.parse(file);
  }

  //add a new test case
  existing.push(testcase);

  //save the updated test cases
  fs.writeFileSync(path, JSON.stringify(existing, null, 2));

  console.log("Test case saved to", path);
  console.log(testcase);

}

// Example
generateTestCase(
  "Returning User",
  "User logs in successfully and reaches dashboard"
);
