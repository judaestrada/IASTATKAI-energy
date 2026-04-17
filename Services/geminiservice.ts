import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

// Initialize the SDK. Ensure your API key is properly loaded.
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const generateEnergyResponse = async (prompt: string): Promise<string> => {
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is missing in the environment variables.");
    }

    try {
        // gemini-1.5-flash is recommended for fast, general-purpose text generation
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: "You are the AI assistant for IASTATKAI energy, a company of renewable energy experts. Provide accurate, professional, and insightful information strictly related to solar, wind, hydro, grid management, and sustainable energy practices."
        });

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Error communicating with Gemini API:", error);
        throw new Error("Failed to generate response from Gemini.");
    }
};