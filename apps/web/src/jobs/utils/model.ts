import { createOpenAI } from "@ai-sdk/openai";

export function getModels() {
  const createPrimaryModel = createOpenAI({
    baseURL: process.env.AI_PRIMARY_ENDPOINT,
    apiKey: process.env.AI_PRIMARY_API_KEY,
  });

  const createSecondaryModel = createOpenAI({
    baseURL: process.env.AI_SECONDARY_ENDPOINT,
    apiKey: process.env.AI_SECONDARY_API_KEY,
  });

  return {
    primary: createPrimaryModel(process.env.AI_PRIMARY_MODEL!),
    secondary: createSecondaryModel(process.env.AI_SECONDARY_MODEL!),
  };
}

export function chooseModel(attempt?: number) {
  const models = getModels();

  // Choose model based on attempt count
  switch (attempt) {
    case 1:
    case 2:
      return {
        model: models.primary,
        mode: "json",
        maxTokens: 8000,
      };
    case 3:
    case 4:
      return {
        model: models.secondary,
        mode: "json",
        maxTokens: 4000,
      };

    default:
      return {
        model: models.primary,
        mode: "json",
        maxTokens: 8000,
      };
  }
}
