export interface SavingsAnalysis {
  recommendations: {
    title: string;
    description: string;
    amount: string;
    amountUsd: string;
    icon: string;
    priority: "high" | "medium" | "low";
  }[];
  insights: string[];
  estimatedCost: {
    icp: number;
    usd: number;
  };
  timeline: {
    months: number;
    targetDate: string;
  };
  monthlySavings: {
    icp: number;
    usd: number;
    percentage: number;
  };
  priority: number;
}

const getAnalyzeResult = async (
  target: string,
  monthlyIncomeUsd: number,
  icpToUsdRate: number = 12.45
) => {
  const monthlyIncomeIcp = monthlyIncomeUsd / icpToUsdRate;
  const promptMessage = `You are a smart financial advisor AI. Analyze this savings goal and be intelligent about it. Target: ${target} Monthly Income: $${monthlyIncomeUsd} USD (${monthlyIncomeIcp.toFixed(
    2
  )} ICP) ICP Rate: 1 ICP = $${icpToUsdRate} USD BE SMART: - If it's food, coffee, small daily stuff (under $50) → suggest immediate purchase, simple budgeting - If it's big goals (vacation, car, house, etc.) → create proper savings plan - Be realistic about costs and timelines - Give practical advice that makes sense Return JSON with exactly this structure, Timeline Prediction is the exactly month and year: { "estimatedCostUsd": number, "savingsPercentage": number, "timelineMonths": number, "isImmediate": boolean, "recommendations": [ {"title": "Optimal Savings Rate", "description": "string", "priority": "high|medium|low"}, {"title": "Timeline Prediction", "description": "string", "priority": "high|medium|low"},], "insights": ["string", "string", "string", "string"], "priority": number 1, 2, or 3 }`;

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
            role: "system",
            content:
              "You are a helpful financial advisor. Always respond with valid JSON only.",
          },
          { role: "user", content: promptMessage },
        ],
      }),
    }
  );

  const json = await completion.json();
  const response = json.choices[0]?.message?.content;
  if (!response) throw new Error("No response from OpenAI");

  const data = JSON.parse(response);

  // Simple calculations
  const costIcp = data.estimatedCostUsd / icpToUsdRate;
  const savingsUsd = data.isImmediate
    ? data.estimatedCostUsd
    : (monthlyIncomeUsd * data.savingsPercentage) / 100;
  const savingsIcp = savingsUsd / icpToUsdRate;

  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + data.timelineMonths);

  // Map recommendations with smart amounts
  const recommendations = data.recommendations.map(
    (
      rec: { title: string; description: string; priority: string },
      index: number
    ) => {
      let amount = "";
      let amountUsd = "";
      let icon = "CheckCircle";

      if (index === 0) {
        // First recommendation
        if (data.isImmediate) {
          amount = `${costIcp.toFixed(4)} ICP`;
          amountUsd = `≈ $${data.estimatedCostUsd.toFixed(2)}`;
          icon = "Target";
        } else {
          amount = `${savingsIcp.toFixed(2)} ICP/month`;
          amountUsd = `≈ $${savingsUsd.toFixed(0)}/month`;
          icon = "TrendingUp";
        }
      } else {
        // Second recommendation
        if (data.isImmediate) {
          amount = "Daily tracking";
          icon = "TrendingUp";
        } else {
          amount =
            data.timelineMonths > 0
              ? targetDate.toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              : "Now";
          icon = "Calendar";
        }
      }

      return {
        title: rec.title,
        description: rec.description,
        amount,
        amountUsd,
        icon,
        priority: rec.priority as "high" | "medium" | "low",
      };
    }
  );

  return {
    recommendations,
    insights: data.insights,
    estimatedCost: { icp: costIcp, usd: data.estimatedCostUsd },
    timeline: {
      months: data.timelineMonths,
      targetDate:
        data.timelineMonths > 0
          ? targetDate.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })
          : "Now",
    },
    monthlySavings: {
      icp: savingsIcp,
      usd: savingsUsd,
      percentage: data.isImmediate ? 0.01 : data.savingsPercentage,
    },
    priority: data.priority,
  };
};

export { getAnalyzeResult };
