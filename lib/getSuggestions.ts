const getSuggestions = async (monthlyIncome: number = 1001) => {
  const promptMessage =
    monthlyIncome === 1001
      ? `You are a financial advisor AI. Generate 6 diverse and popular savings targets that most people can relate to. Create a good mix of: - Essential goals (emergency fund, debt payoff) - Lifestyle goals (vacation, car, home) - Investment goals (retirement, education) - Different time horizons (short-term and long-term) Return ONLY a JSON array of strings, nothing else: ["goal 1", "goal 2", "goal 3", "goal 4", "goal 5", "goal 6"] Make them appealing and motivating for a general audience. Examples: Emergency fund, Dream vacation, New car, House down payment, Retirement savings, Wedding fund, etc.`
      : `You are a financial advisor AI. Generate 6 realistic savings targets for someone with a monthly income of $${monthlyIncome} USD. Consider their income level and suggest appropriate goals: - Mix of short-term and long-term goals - Realistic costs relative to their income - Common life goals that people actually save for - Be diverse (travel, emergency, purchases, investments, etc.) Return ONLY a JSON array of strings, make the suggestion not too details, nothing else: ["goal 1", "goal 2", "goal 3", "goal 4", "goal 5", "goal 6"] Examples based on income: - Low income ($1000-3000): Emergency fund, Used car, Phone upgrade, Small vacation, Course/certification, Medical fund. - Medium income ($3000-7000): New car, Emergency fund, House down payment, Europe vacation, Wedding fund, Business investment. - High income ($7000+): Luxury car, Dream house, World tour, Investment property, Early retirement, Private education. Be specific and realistic. No generic responses.`;

  const completion = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization:
          "Bearer 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",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4.1-nano",
        messages: [
          {
            role: "user",
            content: promptMessage,
          },
        ],
      }),
    }
  );

  const json = await completion.json();
  if (!completion) throw new Error("No response from OpenAI");

  const suggestions = json.choices[0]?.message?.content;

  return JSON.parse(suggestions);
};

export { getSuggestions };
