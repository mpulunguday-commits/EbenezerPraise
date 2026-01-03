
import { GoogleGenAI } from "@google/genai";

/**
 * Validates if the API key is available before initializing the SDK.
 * This prevents runtime crashes in environments where the key isn't set.
 */
const getAIClient = () => {
  const key = process.env.API_KEY;
  if (!key || key === "undefined" || key.trim() === "") {
    return null;
  }
  return new GoogleGenAI({ apiKey: key });
};

// Standard team health summary using Gemini 3 Flash
export const getTeamSummary = async (data: any) => {
  const ai = getAIClient();
  
  if (!ai) {
    return "AI insights are currently unavailable. Please ensure the system API Key is configured in the environment.";
  }

  const prompt = `Based on the following Praise Team data, provide a 3-sentence executive summary of the current health and activities of the team.
  Data: ${JSON.stringify(data)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert organizational consultant for church praise teams."
      }
    });
    return response.text || "Summary analysis completed, but no text was returned.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI service encountered an error while analyzing team records.";
  }
};

// Setlist suggestion logic using Gemini 3 Flash
export const suggestSetlist = async (theme: string, songLibrary: string[]) => {
  const ai = getAIClient();

  if (!ai) {
    return "Setlist suggestions are unavailable without an active AI configuration.";
  }

  const prompt = `The theme for Sunday service is "${theme}". Based on our song library: ${songLibrary.join(', ')}, suggest a setlist of 4 songs (2 praise, 2 worship) with brief justifications.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    return response.text || "No suggestions could be generated for the given theme.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to reach the AI music consultant at this time.";
  }
};
