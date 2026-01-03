import { GoogleGenAI } from "@google/genai";

// Standard team health summary using Gemini 3 Flash
export const getTeamSummary = async (data: any) => {
  // Always use { apiKey: process.env.API_KEY } directly
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
    // Use the .text property directly
    return response.text || "Unable to generate summary at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI operational summary currently unavailable.";
  }
};

// Setlist suggestion logic using Gemini 3 Flash
export const suggestSetlist = async (theme: string, songLibrary: string[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `The theme for Sunday service is "${theme}". Based on our song library: ${songLibrary.join(', ')}, suggest a setlist of 4 songs (2 praise, 2 worship) with brief justifications.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    // Use the .text property directly
    return response.text || "No suggestions found.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI suggestions currently unavailable.";
  }
};