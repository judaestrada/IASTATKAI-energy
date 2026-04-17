import { generateEnergyResponse } from "./geminiservice";

export const processEnergyQuery = async (userQuery: string) => {
    // Validate the input
    if (!userQuery || userQuery.trim() === "") {
        throw new Error("User query cannot be empty.");
    }

    // Optional: Add logging or database storage here for IASTATKAI analytics
    console.log(`[IASTATKAI Analytics] Processing query: ${userQuery}`);

    try {
        const aiResponse = await generateEnergyResponse(userQuery);

        return {
            status: "success",
            provider: "IASTATKAI Energy AI",
            timestamp: new Date().toISOString(),
            data: aiResponse
        };
    } catch (error: any) {
        return {
            status: "error",
            message: error.message || "An unexpected error occurred."
        };
    }
};