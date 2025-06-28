import { openai, isOpenAIAvailable } from './clientOpenAI';

export interface SavingsAnalysis {
  recommendations: {
    title: string;
    description: string;
    amount: string;
    amountUsd: string;
    icon: string;
    priority: 'high' | 'medium' | 'low';
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

export async function analyzeSavingsGoal(
  target: string,
  monthlyIncomeUsd: number,
  icpToUsdRate: number = 12.45
): Promise<SavingsAnalysis> {
  try {
    // Check if OpenAI is available
    if (!isOpenAIAvailable()) {
      console.warn('OpenAI not available, using fallback analysis');
      return getSimpleFallback(target, monthlyIncomeUsd, icpToUsdRate);
    }

    const monthlyIncomeIcp = monthlyIncomeUsd / icpToUsdRate;
    
    const prompt = `
You are a smart financial advisor AI. Analyze this savings goal and be intelligent about it.

Target: ${target}
Monthly Income: $${monthlyIncomeUsd} USD (${monthlyIncomeIcp.toFixed(2)} ICP)
ICP Rate: 1 ICP = $${icpToUsdRate} USD

BE SMART:
- If it's food, coffee, small daily stuff (under $50) → suggest immediate purchase, simple budgeting
- If it's big goals (vacation, car, house, etc.) → create proper savings plan
- Be realistic about costs and timelines
- Give practical advice that makes sense

Return JSON with exactly this structure:
{
  "estimatedCostUsd": number,
  "savingsPercentage": number,
  "timelineMonths": number,
  "isImmediate": boolean,
  "recommendations": [
    {"title": "Optimal Savings Rate", "description": "string", "priority": "high|medium|low"},
    {"title": "Timeline Prediction", "description": "string", "priority": "high|medium|low"},
  ],
  "insights": ["string", "string", "string", "string"],
  "priority": number 1, 2, or 3
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful financial advisor. Always respond with valid JSON only." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No response from OpenAI');

    const data = JSON.parse(response);
    
    // Simple calculations
    const costIcp = data.estimatedCostUsd / icpToUsdRate;
    const savingsUsd = data.isImmediate ? data.estimatedCostUsd : (monthlyIncomeUsd * data.savingsPercentage) / 100;
    const savingsIcp = savingsUsd / icpToUsdRate;
    
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + data.timelineMonths);
    
    // Map recommendations with smart amounts
    const recommendations = data.recommendations.map((rec: { title: string; description: string; priority: string }, index: number) => {
      let amount = "";
      let amountUsd = "";
      let icon = "CheckCircle";
      
      if (index === 0) { // First recommendation
        if (data.isImmediate) {
          amount = `${costIcp.toFixed(4)} ICP`;
          amountUsd = `≈ $${data.estimatedCostUsd.toFixed(2)}`;
          icon = "Target";
        } else {
          amount = `${savingsIcp.toFixed(2)} ICP/month`;
          amountUsd = `≈ $${savingsUsd.toFixed(0)}/month`;
          icon = "TrendingUp";
        }
      } else { // Second recommendation
        if (data.isImmediate) {
          amount = "Daily tracking";
          icon = "TrendingUp";
        } else {
          amount = data.timelineMonths > 0 ? targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Now";
          icon = "Calendar";
        }
      }
      
      return {
        title: rec.title,
        description: rec.description,
        amount,
        amountUsd,
        icon,
        priority: rec.priority as 'high' | 'medium' | 'low',
      };
    });

    return {
      recommendations,
      insights: data.insights,
      estimatedCost: { icp: costIcp, usd: data.estimatedCostUsd },
      timeline: { 
        months: data.timelineMonths, 
        targetDate: data.timelineMonths > 0 ? targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Now"
      },
      monthlySavings: { 
        icp: savingsIcp, 
        usd: savingsUsd, 
        percentage: data.isImmediate ? 0.01 : data.savingsPercentage
      },
      priority: data.priority
    };

  } catch (error) {
    console.error('Error analyzing savings goal:', error);
    return getSimpleFallback(target, monthlyIncomeUsd, icpToUsdRate);
  }
}

// Simple fallback for when OpenAI is not available
function getSimpleFallback(target: string, monthlyIncomeUsd: number, icpToUsdRate: number): SavingsAnalysis {
  const isSmall = target.toLowerCase().match(/makan|food|mie|coffee|lunch|snack|drink/);
  const costUsd = isSmall ? 5 : Math.min(1000, monthlyIncomeUsd * 2);
  const costIcp = costUsd / icpToUsdRate;
  const months = isSmall ? 0 : Math.ceil(costUsd / (monthlyIncomeUsd * 0.2));
  
  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + months);
  
  return {
    recommendations: [
      {
        title: isSmall ? "Go Buy It!" : "Smart Savings Plan",
        description: isSmall 
          ? "This is a small purchase - just budget for it this month!"
          : `Save ${(costUsd / monthlyIncomeUsd * 100).toFixed(1)}% of your monthly income to reach this goal.`,
        amount: isSmall ? `${costIcp.toFixed(4)} ICP` : `${(costIcp / months).toFixed(2)} ICP/month`,
        amountUsd: isSmall ? `≈ $${costUsd.toFixed(2)}` : `≈ $${(costUsd / months).toFixed(0)}/month`,
        icon: isSmall ? "Target" : "TrendingUp",
        priority: "high" as const,
      },
      {
        title: "Timeline",
        description: isSmall 
          ? "Track your daily spending to stay on budget."
          : `You can achieve this goal by ${targetDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.`,
        amount: isSmall ? "Daily tracking" : targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        amountUsd: "",
        icon: isSmall ? "TrendingUp" : "Calendar",
        priority: "medium" as const,
      },
    ],
    insights: [
      isSmall 
        ? "This is a small daily expense that fits within your budget."
        : "This goal requires disciplined saving but is achievable with your current income.",
      `Your monthly income of $${monthlyIncomeUsd} provides good flexibility for this target.`,
      "Consider using ICP staking to earn additional rewards while saving.",
      "Track your progress regularly to stay motivated."
    ],
    estimatedCost: { icp: costIcp, usd: costUsd },
    timeline: { 
      months, 
      targetDate: months > 0 ? targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Now"
    },
    monthlySavings: { 
      icp: isSmall ? costIcp : costIcp / months, 
      usd: isSmall ? costUsd : costUsd / months, 
      percentage: isSmall ? 0.01 : (costUsd / months / monthlyIncomeUsd * 100)
    },
    priority: isSmall ? 1 : 2
  };
}