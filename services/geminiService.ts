
import { GoogleGenAI } from "@google/genai";

// Safe initialization: Prevent crash if API_KEY is undefined during chunk load
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will be unavailable.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const ai = getAIClient();

export const generateFollowUpEmail = async (customerName: string, context: string) => {
  if (!ai) return "AI Service not configured. Please check your API key.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Draft a professional pharma marketing follow-up email for ${customerName}. 
      Context of the inquiry: ${context}. 
      Keep it professional, emphasize product quality and reliability, and suggest a meeting time.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating content. Please try again.";
  }
};

export const analyzeSalesTrends = async (dataSummary: string) => {
  if (!ai) return "AI Service unavailable.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these pharma sales inquiry trends: ${dataSummary}. 
      Provide 3 actionable insights for the marketing team to improve conversion.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not analyze trends.";
  }
};

export const generateReportSummary = async (reportType: string, data: string) => {
  if (!ai) return "AI analysis unavailable.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert Pharma Marketing Analyst. 
      Analyze the following ${reportType} report data: ${data}. 
      Provide a concise 3-sentence summary of findings and one strategic recommendation for the sales team.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI was unable to generate a summary for this report.";
  }
};
