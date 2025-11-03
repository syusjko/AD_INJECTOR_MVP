import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

// It's assumed that process.env.API_KEY is configured in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const model = 'gemini-2.5-flash';

// Schema for the structured ad creative data
const adCreativeSchema = {
  type: Type.OBJECT,
  properties: {
    brandName: {
        type: Type.STRING,
        description: 'A compelling, single-word name for the fictional brand (e.g., Aetherium, Nova, Momentum).'
    },
    creativeBrief: {
      type: Type.STRING,
      description: 'A detailed advertising creative brief (2-3 sentences) for the fictional, high-concept brand based on the user\'s prompt. This brief guides an AI to weave the brand\'s ethos into a response.'
    },
    headline: {
      type: Type.STRING,
      description: 'A short, compelling banner headline (under 10 words).'
    },
    cta: {
      type: Type.STRING,
      description: 'A catchy Call To Action text for a button (2-3 words), like "Discover More" or "Explore Now".'
    },
    url: {
      type: Type.STRING,
      description: 'A real, publicly accessible, and relevant website URL that aligns with the brand concept. Must be a valid URL. Example: https://www.example.com'
    }
  },
  required: ['brandName', 'creativeBrief', 'headline', 'cta', 'url']
};


export const generateAdCreative = async (prompt: string): Promise<any> => {
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: `Analyze the user's prompt below. Based on its core themes, conceptualize a fictional, high-concept brand or product. Then, acting as a digital marketing strategist, generate a creative package for this brand. The package must include a brand name, a creative brief, a banner headline, a call-to-action text, and a URL for a REAL, relevant website that aligns with the brand's abstract concept.

User Prompt: "${prompt}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: adCreativeSchema,
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating structured ad creative:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API JSON call failed: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the ad creative.");
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