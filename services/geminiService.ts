import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// It's assumed that process.env.API_KEY is configured in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const model = 'gemini-2.5-flash';

export const generateTextStream = async (prompt: string): Promise<AsyncGenerator<GenerateContentResponse>> => {
  try {
    const response = await ai.models.generateContentStream({
      model: model,
      contents: prompt,
    });
    return response;
  } catch (error) {
    console.error("Error starting stream generation:", error);
    if (error instanceof Error) {
      throw new Error(`Gemini API stream call failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred while starting the stream response.");
  }
};