import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

// It's assumed that process.env.API_KEY is configured in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const model = 'gemini-2.5-flash';

// Schema for a single structured contextual ad suggestion
const sponsoredSuggestionObjectSchema = {
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
    },
    imageUrl: {
        type: Type.STRING,
        description: 'A real, publicly accessible, and high-quality image URL that is highly relevant to and visually represents the product or brand concept. The image should be directly related to the user\'s prompt. Use a stock photo website like Pexels or Unsplash.'
    }
  },
  required: ['brandName', 'productName', 'suggestionText', 'headline', 'cta', 'url', 'imageUrl']
};

// Schema for an array of sponsored suggestions
const sponsoredSuggestionSchema = {
    type: Type.ARRAY,
    description: "A list of exactly 3 sponsored suggestions related to the user's prompt.",
    items: sponsoredSuggestionObjectSchema
};

const thinkingStepsSchema = {
    type: Type.ARRAY,
    description: "A list of 4-6 plausible, detailed thinking steps an AI would take to formulate a comprehensive response to the user's prompt.",
    items: { type: Type.STRING }
}


export const generateSponsoredSuggestion = async (prompt: string): Promise<any[]> => {
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: `The user's original prompt is: "${prompt}"`,
            config: {
                systemInstruction: `You are a sophisticated AI advertising strategist. Your task is to first detect the language of the user's prompt. Then, analyze the user's prompt to anticipate the key topics of the likely AI response. Based on this prediction, you will invent three distinct fictional brands with specific products/services. For each, find a relevant, real, high-quality image URL and a relevant, real website URL that offers a tangible solution related to the user's query. All generated text content (brandName, productName, suggestionText, headline, cta) MUST be in the same language as the user's original prompt. Your output must be a valid JSON array of exactly 3 objects matching the provided schema.`,
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

export const generateThinkingSteps = async (prompt: string): Promise<string[]> => {
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: `Based on the user's prompt: "${prompt}"`,
            config: {
                systemInstruction: `You are a meta-cognition AI. Your task is to generate a plausible, high-level list of thinking steps that an advanced AI would take to answer the user's prompt. The steps should be specific to the prompt's topic. Generate between 4 and 6 distinct steps. The steps must be in the same language as the user's prompt (detect it first). Your output must be a valid JSON array of strings, where each string is a thinking step. For example, for "What is the importance of teamwork?", you might generate ["Defining teamwork and its core components", "Analyzing the psychological benefits for team members", "Outlining productivity advantages in a business context", "Summarizing with real-world examples"].`,
                responseMimeType: "application/json",
                responseSchema: thinkingStepsSchema,
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating thinking steps:", error);
        // Don't throw a fatal error, the app can use a default.
        return [];
    }
};

export const generateSponsoredIntroText = async (prompt: string, mainResponse: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: `User's prompt: "${prompt}"\n\nAI's response: "${mainResponse}"\n\nBased on the above, write the transition paragraph.`,
            config: {
                systemInstruction: `You are a helpful AI assistant. Your role is to write a short, engaging, and seamless transition paragraph. This paragraph should logically connect the user's initial query and the detailed AI response they just received to a set of related sponsored tools or resources that will be shown next. The tone must be conversational, helpful, and insightful, framing the upcoming suggestions as valuable next steps or practical applications of the information provided. It should NOT sound like an advertisement. All generated text MUST be in the same language as the user's original prompt. The output should be a single paragraph of plain text.`
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating sponsored intro text:", error);
        return "다음은 회원님의 질문과 관련하여 도움이 될 만한 몇 가지 추가 정보입니다."; // Generic fallback
    }
}


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