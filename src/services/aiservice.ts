// src/services/aiService.ts
export const askGemini = async (data: any, context: string) => {
  const response = await fetch("/api/ai/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data, context }),
  });
 // Change line 8 to this:
const json = await response.json();
return json.response;
}