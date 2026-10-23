// import { GoogleGenAI } from "@google/genai";

// // Gemini API client
// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// // ========================================
// // OpenRouter API - Preserved for future use
// // ========================================

// /*
// import axios from "axios";

// export const askAi = async ({ message }) => {
//   try {
//     if (!Array.isArray(message) || message.length === 0) {
//       throw new Error("Message array is empty.");
//     }

//     const response = await axios.post(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         model: "openrouter/free",
//         messages: message,
//         response_format: { type: "json_object" },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const content = response?.data?.choices?.[0]?.message?.content;

//     if (typeof content !== "string" || !content.trim()) {
//       console.log("OpenRouter response:", response.data);
//       throw new Error("AI returned an empty response.");
//     }

//     console.log("AI CONTENT:", content);

//     return content;
//   } catch (error) {
//     console.error(
//       "OpenRouter Error:",
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };
// */

// // ========================================
// // Gemini API - Currently Active
// // ========================================

// export const askAi = async ({ message }) => {
//   try {
//     if (!Array.isArray(message) || message.length === 0) {
//       throw new Error("Message array is empty.");
//     }

//     // Convert existing messages into a Gemini prompt
//     const prompt = message
//       .map((item) => {
//         const role =
//           item.role === "assistant" ? "Assistant" : "User";

//         return `${role}: ${item.content}`;
//       })
//       .join("\n\n");

//     const response = await ai.models.generateContent({
//       model: "gemini-3.5-flash",
//       contents: prompt,
//       config: {
//         responseMimeType: "application/json",
//       },
//     });

//     const content = response.text;

//     if (typeof content !== "string" || !content.trim()) {
//       console.log("Gemini response:", response);
//       throw new Error("AI returned an empty response.");
//     }

//     console.log("GEMINI CONTENT:", content);

//     return content;
//   } catch (error) {
//     console.error(
//       "Gemini Error:",
//       error.message
//     );

//     throw error;
//   }
// };


import { GoogleGenAI } from "@google/genai";

// Keep your original OpenRouter code commented below for future use.

export const askAi = async ({ message }) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing from environment variables.");
    }

    if (!Array.isArray(message) || message.length === 0) {
      throw new Error("Message array is empty.");
    }

    // Initialize only when the function is called.
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = message
      .map((item) => {
        const role =
          item.role === "assistant"
            ? "Assistant"
            : item.role === "system"
              ? "Instructions"
              : "User";

        return `${role}: ${item.content}`;
      })
      .join("\n\n");

    const response = await ai.models.generateContent({
      // Keep your currently configured model for this first test.
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const content = response.text;

    if (typeof content !== "string" || !content.trim()) {
      throw new Error("Gemini returned an empty response.");
    }

    console.log("Gemini response received successfully.");
    return content;
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    throw error;
  }
};

/*
  Keep your original OpenRouter implementation commented here.
*/