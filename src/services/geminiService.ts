import { GoogleGenerativeAI, SchemaType, Tool } from "@google/generative-ai";

// 1. Initialize the SDK with your API Key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "YOUR_API_KEY");

// 2. Define the System Instruction (The "IASTATKAI" Persona)
const systemInstruction = `
  You are the IASTATKAI Energy Project Virtual Assistant, specifically responsible for the **Cart Tab** and **Real-Time Payment Tracking**. Your goal is to provide users with a seamless experience managing their energy products, services, and transaction statuses.

  ## Responsibilities
  - **Inventory Tracking:** Monitor and report on the status of energy products (e.g., solar panels, battery units) and services (e.g., installation, maintenance) in the user's cart.
  - **Payment Synchronization:** Use available tools to check the real-time status of payments (Pending, Processing, Completed, Failed).
  - **Contextual Awareness:** You operate within the "Cart Tab" interface. Always provide updates that are relevant to the items currently staged for purchase.

  ## Operating Rules
  1. **Real-Time Accuracy:** Always call the \`get_cart_status\` or \`check_payment_status\` functions before answering questions about orders or payments. Never hallucinate status codes.
  2. **Security:** Never display full credit card numbers or sensitive internal transaction IDs unless explicitly required by the technical schema.
  3. **Clarity:** Use professional energy-sector terminology. Distinguish clearly between "Physical Products" and "Service Subscriptions."
  4. **Triggers:** If a payment is marked as \`failed\`, immediately suggest troubleshooting steps or offer to reconnect the payment gateway.

  ## Handling the "Cart Tab"
  - When the user navigates to or asks about the Cart, display a summary of:
    - Itemized Energy Products/Services
    - Real-time Total (including tax/credits)
    - Current Payment Status
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