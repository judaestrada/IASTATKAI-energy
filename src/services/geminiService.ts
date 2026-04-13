import { GoogleGenerativeAI, SchemaType, Tool } from "@google/generative-ai";

// 1. Initialize the SDK with your API Key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "YOUR_API_KEY");

// 2. Define the System Instruction (The "IASTATKAI" Persona)
const systemInstruction = `
  You are the IASTATKAI Agent, a specialized assistant for IASTATKAI energy.
  Your goal is to [Describe your agent's specific goal here].
  Always remain professional and use the tools provided to fetch real-time data.
`;

// 3. Define Tools/Functions (This is what makes it an "Agent")
const tools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "get_user_data",
        description: "Fetches user statistics from the IASTATKAI energy database.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            userId: { type: SchemaType.STRING, description: "The unique ID of the user" }
          },
          required: ["userId"]
        }
      }
    ]
  }
];

// 4. Initialize the Model
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro", // Or "gemini-2.0-flash" for speed
  systemInstruction: systemInstruction,
  tools: tools,
});

// 5. Manage the Chat Session
let chatSession: any = null;

export const sendMessage = async (userInput: string, history: any[] = []) => {
  try {
    // Start session if it doesn't exist
    if (!chatSession) {
      chatSession = model.startChat({
        history: history,
        generationConfig: {
          maxOutputTokens: 2000,
          temperature: 0.7,
        },
      });
    }

    const result = await chatSession.sendMessage(userInput);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw error;
  }
};