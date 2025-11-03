
import { GoogleGenAI } from "@google/genai";

// It's assumed that process.env.API_KEY is configured in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const model = 'gemini-2.5-flash';

export const generateText = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    if (error instanceof Error) {
      // Re-throw a more user-friendly error or log it.
      throw new Error(`Gemini API call failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the response.");
  }
};
