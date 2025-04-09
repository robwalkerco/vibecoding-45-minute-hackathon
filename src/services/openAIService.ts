import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const suggestCity = async (city: string): Promise<string | null> => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that suggests the most likely city name when given a misspelled or incomplete city name. Only respond with the city name, nothing else.",
        },
        {
          role: "user",
          content: `What is the most likely city name for: ${city}? Only respond with the city name, nothing else.`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    const suggestedCity = completion.choices[0]?.message?.content?.trim();
    return suggestedCity || null;
  } catch (error) {
    console.error("Error getting city suggestion:", error);
    return null;
  }
};
