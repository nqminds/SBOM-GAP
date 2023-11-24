/* eslint-disable no-console */
import OpenAI from "openai";
import { getApiKey } from "./utils.mjs";

const apiKey = getApiKey("openai");

// eslint-disable-next-line no-promise-executor-return
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function openaiRequest(
  prompt,
  responseTokens,
  openaiApiKey = "",
  maxRetries = 3,
  backoffTime = 1,
  retries = 0
) {
  let openai;
  if (openaiApiKey !== "") {
    openai = new OpenAI(openaiApiKey);
  } else if (apiKey) {
    openai = new OpenAI(apiKey);
  } else {
    openai = new OpenAI();
  }

  const promptTokensProcessed = 0;
  const responseTokensProcessed = 0;

  // Count tokens
  const promptTokens = countTokens(prompt);

  try {
    const messages = [{ role: "user", content: prompt }];
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.0,
      max_tokens: responseTokens,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    const tokensProcessed =
      promptTokens + countTokens(response.choices[0].message.content);

    return {
      result: "success",
      response: response.choices[0].message.content.trim(),
      promptTokensProcessed,
      responseTokensProcessed: tokensProcessed - promptTokens,
    };
  } catch (error) {
    if (error.message.includes("maximum context length")) {
      console.log("Prompt was too long...");
      return {
        result: "context_too_long",
        response: "",
        promptTokensProcessed,
        responseTokensProcessed,
      };
    } else if (retries < maxRetries) {
      console.log(
        `Retrying in ${backoffTime} seconds...: error: ${error.message}`
      );
      await sleep(backoffTime * 100);
      return await openaiRequest(
        prompt,
        responseTokens,
        openaiApiKey,
        maxRetries,
        backoffTime * 2,
        retries + 1
      );
    } else {
      console.log("Max retries reached.");
      return {
        result: "api_error",
        response: "",
        promptTokensProcessed,
        responseTokensProcessed,
      };
    }
  }
}

// Placeholder for token counting function
function countTokens(text) {
  return text.length;
}

function formatResponseString(responseString) {
  // Trim whitespace from the response string
  let trimmed = responseString.trim();

  // Check if the string is already in JSON object format
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  // Remove any trailing '}' characters that are not part of a proper JSON object
  if (trimmed.endsWith("}")) {
    trimmed = trimmed.substring(0, trimmed.lastIndexOf("}"));
  }

  // Wrap the string in curly braces to form a JSON object
  return `{${trimmed}}`;
}

/**
 * Classifies a given description using openai API
 *
 * @param {string} description - CVE description
 * @param {string} openaiApiKey - OpenAi API key
 * @param {Int16Array} maxRetries - How many times to recall the API in case of an error
 * @param {Int16Array} currentRetry - Defaults to 0
 * @returns  {string []} - Classification output
 */
export async function makeClassificationRequest(
  description,
  openaiApiKey,
  maxRetries = 3,
  currentRetry = 0
) {
  if (currentRetry > maxRetries) {
    console.log(
      `Max retries reached for CWE description: ${description.substring(
        0,
        20
      )}... Skipping...`
    );
    return { classification: "Unknown" };
  }

  try {
    const prompt = `
    The following is an example of how to classify a security vulnerability described by some source text.

    The source text is:

    "${description}"

    The classifications are:

    not-memory-related: This means that the vulnerability is unrelated to how dynamic memory is allocated or accessed.
    spatial-memory-related: This means that the vulnerability is due to where in dynamic memory a read or write occurs and includes buffer overruns, buffer underruns, null pointer dereference, etc.
    temporal-memory-related: This means that the vulnerability is due to the order in which dynamic memory operations occur and includes use-after-free.
    other-memory-related: This means that the vulnerability relates to how dynamic memory is allocated or accessed but is not a spatial or temporal problem.

    {
        "classification": "not-memory-related|spatial-memory-related|temporal-memory-related|other-memory-related"
    }

    The output is:

    {`;

    const response = await openaiRequest(prompt, 2048, openaiApiKey);
    let classification;
    try {
      const formattedResponse = formatResponseString(response.response);
      const responseData = JSON.parse(formattedResponse);

      classification = responseData.classification;
    } catch (error) {
      console.error("Failed to parse response:", error);
    }
    return classification;
  } catch (error) {
    if (error instanceof SyntaxError || error.name === "KeyError") {
      console.log(
        `Failed to parse response or extract fields for CWE description: ${description.substring(
          0,
          50
        )}... Retrying...${error.message}`
      );
      return makeClassificationRequest(
        description,
        maxRetries,
        currentRetry + 1
      );
    } else {
      console.log(
        `Unexpected error occurred: ${
          error.message
        } for CWE description: ${description.substring(0, 50)}... Skipping...`
      );
      return { classification: "Unknown" };
    }
  }
}
