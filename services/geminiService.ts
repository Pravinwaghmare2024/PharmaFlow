
import { GoogleGenAI } from "@google/genai";

/* 
 * Re-creating the GoogleGenAI instance inside each function ensures it always uses 
 * the most up-to-date API key from the environment/dialog, as per guidelines.
 */

export const generateFollowUpEmail = async (customerName: string, context: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
