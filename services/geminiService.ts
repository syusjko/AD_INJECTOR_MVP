import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

// It's assumed that process.env.API_KEY is configured in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const model = 'gemini-2.5-flash';

// Schema for the structured contextual ad suggestion
const sponsoredSuggestionSchema = {
  type: Type.OBJECT,
  properties: {
    brandName: {
      type: Type.STRING,
      description: 'A compelling, single-word name for a fictional brand (e.g., Nexus, Clarity, Forge).'
    },
    productName: {
        type: Type.STRING,
        description: 'A specific, tangible product or service name from the brand (e.g., "Nexus Flow", "Clarity Hub", "Forge CRM").'
    },
    suggestionText: {
      type: Type.STRING,
      description: 'A concise, helpful tip (2-4 sentences) that connects a key concept from the user\'s prompt to the fictional product. It should anticipate the user\'s need and smoothly introduce the product as a practical solution. The tone should be helpful and assistive, not a hard sell.'
    },
    headline: {
      type: Type.STRING,
      description: 'A short, compelling banner headline (under 10 words) for the product.'
    },
    cta: {
      type: Type.STRING,
      description: 'A catchy Call To Action text for a button (2-3 words), like "Explore Tool" or "Learn More".'
    },
    url: {
      type: Type.STRING,
      description: 'A real, publicly accessible, and relevant website URL that aligns with the brand concept. Must be a valid URL.'
    }
  },
  required: ['brandName', 'productName', 'suggestionText', 'headline', 'cta', 'url']
};


export const generateSponsoredSuggestion = async (prompt: string): Promise<any> => {
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: `The user's original prompt is: "${prompt}"`,
            config: {
                systemInstruction: `You are a sophisticated AI advertising strategist. Your task is to analyze the user's prompt to anticipate the key topics of the likely AI response. Based on this prediction, you will invent a fictional brand and a specific product/service that offers a tangible solution or enhancement related to the user's query. Your output must be a valid JSON object matching the provided schema.`,
                responseMimeType: "application/json",
                responseSchema: sponsoredSuggestionSchema,
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating sponsored suggestion:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API JSON call failed: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the sponsored suggestion.");
    }
};

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