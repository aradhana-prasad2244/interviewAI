import axios from "axios";

export const askAi = async ({ message }) => {
  try {
    if (!Array.isArray(message) || message.length === 0) {
      throw new Error("Message array is empty.");
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openrouter/free",
        messages: message,
        response_format: { type: "json_object" },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response?.data?.choices?.[0]?.message?.content;

    if (typeof content !== "string" || !content.trim()) {
      console.log("OpenRouter response:", response.data);
      throw new Error("AI returned an empty response.");
    }

    console.log("AI CONTENT:", content);

    return content;
  } catch (error) {
    console.error(
      "OpenRouter Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

