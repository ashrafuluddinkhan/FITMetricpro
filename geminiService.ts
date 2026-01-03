
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFitnessInsights = async (dataSummary: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Evaluate the following fitness data summary and provide insights on efficiency, health trends, and actionable recommendations.
      Data Summary:
      ${dataSummary}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Executive summary of the dataset." },
            metrics: {
              type: Type.OBJECT,
              properties: {
                efficiency: { type: Type.NUMBER, description: "Calories per hour score (0-100)." },
                intensity: { type: Type.NUMBER, description: "Average intensity score (0-100)." },
                hydrationAdequacy: { type: Type.NUMBER, description: "Hydration adequacy score (0-100)." }
              }
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Actionable health and fitness tips."
            }
          },
          required: ["summary", "metrics", "recommendations"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return null;
  }
};

export const chatWithFitnessExpert = async (query: string, dataContext: string) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are an elite fitness data scientist. Answer the user query based on this dataset context: ${dataContext}. 
        User query: ${query}`,
        config: {
            systemInstruction: "Be concise, evidence-based, and encouraging."
        }
      });
      return response.text;
    } catch (error) {
        return "Sorry, I couldn't process that query right now.";
    }
};
