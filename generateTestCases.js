import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY
});

const template = `
Create a QA test case using this structure:

Test ID:
Persona:
Description:
Preconditions:
Steps:
Expected Result:

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

  console.log("\nGENERATED TEST CASE\n");
  console.log(response);
}

// Example
generateTestCase(
  "Returning User",
  "User logs in successfully and reaches dashboard"
);
