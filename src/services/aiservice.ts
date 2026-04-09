// src/services/aiService.ts

// 1. Define expected response types based on our Express backend
export interface AIResponse {
  response?: string;
  error?: string;
}

export const askGemini = async (data: any, context: string): Promise<string> => {
  try {
    const response = await fetch("/api/ai/analyze", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ data, context }),
    });

    // Parse the JSON body
    const result: AIResponse = await response.json();

    // 2. Catch HTTP errors (e.g., 400 missing data, 500 AI API failure)
    if (!response.ok) {
      throw new Error(result.error || `Server error: ${response.status}`);
    }

    // 3. Return strictly the text response so the UI components are cleaner
    if (!result.response) {
      throw new Error("No response received from the AI.");
    }

    return result.response;

  } catch (error) {
    // Log the error for debugging and re-throw so the UI can show a warning/toast
    console.error("Error communicating with AI Agent:", error);
    throw error; 
  }
};