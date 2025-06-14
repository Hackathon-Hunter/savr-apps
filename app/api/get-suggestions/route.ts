import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { monthlyIncome } = await request.json();

    const prompt = monthlyIncome === 5000 ? `
You are a financial advisor AI. Generate 6 diverse and popular savings targets that most people can relate to.

Create a good mix of:
- Essential goals (emergency fund, debt payoff)
- Lifestyle goals (vacation, car, home)
- Investment goals (retirement, education)
- Different time horizons (short-term and long-term)

Return ONLY a JSON array of strings, nothing else:
["goal 1", "goal 2", "goal 3", "goal 4", "goal 5", "goal 6"]

Make them appealing and motivating for a general audience. Examples:
Emergency fund, Dream vacation, New car, House down payment, Retirement savings, Wedding fund, etc.

Be specific and inspiring. No generic responses.
` : `
You are a financial advisor AI. Generate 6 realistic savings targets for someone with a monthly income of $${monthlyIncome} USD.

Consider their income level and suggest appropriate goals:
- Mix of short-term and long-term goals
- Realistic costs relative to their income
- Common life goals that people actually save for
- Be diverse (travel, emergency, purchases, investments, etc.)

Return ONLY a JSON array of strings, nothing else:
["goal 1", "goal 2", "goal 3", "goal 4", "goal 5", "goal 6"]

Examples based on income:
- Low income ($1000-3000): Emergency fund, Used car, Phone upgrade, Small vacation, Course/certification, Medical fund
- Medium income ($3000-7000): New car, Emergency fund, House down payment, Europe vacation, Wedding fund, Business investment
- High income ($7000+): Luxury car, Dream house, World tour, Investment property, Early retirement, Private education

Be specific and realistic. No generic responses.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful financial advisor. Always respond with valid JSON array only." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No response from OpenAI');

    const suggestions = JSON.parse(response);
    
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    
    // Fallback suggestions based on income ranges
    const monthlyIncome = await request.json().then(data => data.monthlyIncome).catch(() => 5000);
    
    let fallbackSuggestions;
    if (monthlyIncome < 3000) {
      fallbackSuggestions = [
        "Emergency fund (3 months)",
        "Used car purchase",
        "Phone upgrade",
        "Weekend getaway",
        "Online course",
        "Medical fund"
      ];
    } else if (monthlyIncome < 7000) {
      fallbackSuggestions = [
        "New car purchase",
        "Emergency fund (6 months)",
        "House down payment",
        "Europe vacation",
        "Wedding fund",
        "Investment account"
      ];
    } else {
      fallbackSuggestions = [
        "Luxury car",
        "Dream house down payment",
        "World tour vacation",
        "Investment property",
        "Early retirement fund",
        "Children's education"
      ];
    }
    
    return NextResponse.json({ suggestions: fallbackSuggestions });
  }
} 