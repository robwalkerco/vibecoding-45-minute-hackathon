import axios from "axios";

const API_KEY =
  "REMOVED_API_KEY";

export const suggestCity = async (input: string): Promise<string | null> => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that suggests the most likely city name when given a misspelled or ambiguous city name. Respond with only the city name, nothing else.",
          },
          {
            role: "user",
            content: `What is the most likely city name for: "${input}"?`,
          },
        ],
        temperature: 0.7,
        max_tokens: 50,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const suggestedCity = response.data.choices[0].message.content.trim();
    return suggestedCity;
  } catch (error) {
    console.error("Error getting city suggestion:", error);
    return null;
  }
};
