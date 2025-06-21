"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Target,
  DollarSign,
  Brain,
  Sparkles,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Particles from "@/components/reactbits/Particles/Particles";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { useSavingsAnalysis } from "@/contexts/SavingsAnalysisContext";
import { useAuth } from "@/hooks/useAuth";
import { prompt } from "@/service/icService";
import { SavingsAnalysis } from "@/lib/analysis";

export default function InputTarget() {
  const router = useRouter();
  const { setAnalysisData, setUserInput, icpToUsdRate } = useSavingsAnalysis();
  const { actor } = useAuth();
  const [target, setTarget] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errors, setErrors] = useState({ target: "", income: "" });
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);

  // Simple fallback for when LLM doesn't return JSON
  const getSimpleFallback = (target: string) => {
    const isSmall = target.toLowerCase().match(/food|coffee|lunch|snack|drink|makan|mie/);
    const costUsd = isSmall ? 5 : 1000;
    
    return {
      estimatedCostUsd: costUsd,
      savingsPercentage: isSmall ? 0.01 : 15,
      timelineMonths: isSmall ? 0 : 12,
      isImmediate: isSmall,
      recommendations: [
        {
          title: isSmall ? "Go Buy It!" : "Start Saving",
          description: isSmall ? "You can afford this right now" : "Save consistently each month",
          priority: "high"
        },
        {
          title: "Track Spending",
          description: "Monitor your expenses",
          priority: "medium"
        }
      ],
      insights: [
        isSmall ? "Simple pleasures are okay within budget" : "Consistent saving leads to success",
        "Track your spending patterns",
        "Make conscious money decisions",
        "Balance enjoying today with planning tomorrow"
      ],
      priority: 1
    };
  };

  // Load initial AI suggestions on page load
  useEffect(() => {
    const fetchInitialSuggestions = async () => {
      setLoadingSuggestions(true);
      try {
        const response = await fetch("/api/get-suggestions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ monthlyIncome: 5000 }), // Use average income for initial suggestions
        });

        if (response.ok) {
          const data = await response.json();
          setAiSuggestions(data.suggestions || []);
        }
      } catch (error) {
        console.error("Error fetching initial suggestions:", error);
        // Fallback to default suggestions
        setAiSuggestions([
          "Emergency fund (6 months)",
          "New car purchase",
          "Dream vacation",
          "House down payment",
          "Investment account",
          "Education fund",
        ]);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    fetchInitialSuggestions();
  }, []);

  const validateForm = () => {
    const newErrors = { target: "", income: "" };
    let isValid = true;

    if (!target.trim()) {
      newErrors.target = "Please enter your target";
      isValid = false;
    }

    if (!monthlyIncome.trim()) {
      newErrors.income = "Please enter your monthly income";
      isValid = false;
    } else if (isNaN(Number(monthlyIncome)) || Number(monthlyIncome) <= 0) {
      newErrors.income = "Please enter a valid amount";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAnalyze = async () => {
    if (!validateForm()) return;
    if (!actor) {
      alert("Please connect your wallet first");
      return;
    }

    setIsAnalyzing(true);

    try {
      // Store user input
      const monthlyIncomeUsd = Number(monthlyIncome);
      setUserInput({
        target,
        monthlyIncome: monthlyIncomeUsd,
      });

      // Call ICP canister directly
      const monthlyIncomeIcp = monthlyIncomeUsd / icpToUsdRate;
      const promptMessage = `You are a financial advisor AI. Analyze this savings goal and respond with ONLY valid JSON.

Target: ${target}
Monthly Income: $${monthlyIncomeUsd} USD (${monthlyIncomeIcp.toFixed(2)} ICP)
ICP Rate: 1 ICP = $${icpToUsdRate} USD

Rules:
- If it's food/coffee/small items (under $50) → immediate purchase
- If it's big goals (vacation/car/house) → savings plan
- Be realistic about costs

RESPOND WITH ONLY THIS JSON STRUCTURE (no other text):
{
  "estimatedCostUsd": ${target.toLowerCase().match(/food|coffee|lunch|snack|drink|makan|mie/) ? 5 : 1000},
  "savingsPercentage": ${target.toLowerCase().match(/food|coffee|lunch|snack|drink|makan|mie/) ? 0.01 : 15},
  "timelineMonths": ${target.toLowerCase().match(/food|coffee|lunch|snack|drink|makan|mie/) ? 0 : 12},
  "isImmediate": ${target.toLowerCase().match(/food|coffee|lunch|snack|drink|makan|mie/) ? 'true' : 'false'},
  "recommendations": [
    {"title": "Optimal Savings Rate", "description": "Save consistently for your goal", "priority": "high"},
    {"title": "Timeline Prediction", "description": "Realistic timeframe based on income", "priority": "medium"}
  ],
  "insights": ["Be consistent with savings", "Track your progress", "Adjust as needed", "Stay motivated"],
  "priority": 1
}`;

      // Get response from ICP canister
      const response = await prompt(actor, promptMessage);
      if (!response) throw new Error('No response from ICP canister');

      // Parse and transform the response
      let data;
      try {
        data = JSON.parse(response);
      } catch {
        console.error('Response is not valid JSON:', response);
        // Fallback: create a simple analysis based on the target
        data = getSimpleFallback(target);
      }
      
      // Transform to SavingsAnalysis format
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

      const analysis: SavingsAnalysis = {
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

      setAnalysisData(analysis);
      setIsAnalyzing(false);
      router.push("analysis-results");
    } catch (error) {
      console.error("Error during analysis:", error);
      setIsAnalyzing(false);
      // You could show an error message to the user here
      alert(
        "Sorry, there was an error analyzing your savings goal. Please try again."
      );
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Fetch AI-generated suggestions based on income
  const fetchAISuggestions = async (income: number) => {
    if (income <= 0) return;

    setLoadingSuggestions(true);
    try {
      const response = await fetch("/api/get-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ monthlyIncome: income }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      // Fallback to default suggestions
      setAiSuggestions([
        "Emergency fund",
        "New car",
        "Vacation fund",
        "Home down payment",
        "Investment account",
        "Education fund",
      ]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Fetch suggestions when income changes
  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMonthlyIncome(value);
  };

  const handleOnBlurIncome = () => {
    fetchAISuggestions(Number(monthlyIncome));
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-black">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />

      {/* Breadcrumb Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-8 left-8 z-20"
      >
        <div className="flex items-center space-x-2 text-white/70">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 hover:text-white transition-colors duration-300 group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform duration-300"
            />
            <span className="text-sm font-medium">Dashboard</span>
          </button>
          <ChevronRight size={16} className="text-white/40" />
          <span className="text-sm text-white/60">Input Saving</span>
        </div>
      </motion.div>

      {/* Particles Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={120}
          particleSpread={8}
          speed={0.08}
          particleBaseSize={120}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex justify-center items-center min-h-screen px-4 py-20">
        <div className="w-full max-w-lg">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10">
                <Target size={32} className="text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Set Your Target
            </h1>
            <p className="text-white/60 text-lg font-light tracking-wide">
              Tell us your goal and let AI create your savings plan
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Monthly Income Input */}
            <div className="relative group">
              <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-500">
                <label className="text-white/80 text-sm font-medium mb-3 flex items-center space-x-2">
                  <DollarSign size={16} />
                  <span>Monthly Income</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60">
                    $
                  </span>
                  <input
                    type="number"
                    value={monthlyIncome}
                    onChange={handleIncomeChange}
                    onBlur={handleOnBlurIncome}
                    placeholder="5000"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300"
                  />
                </div>
                {errors.income && (
                  <p className="text-red-400 text-sm mt-2">{errors.income}</p>
                )}
              </div>
            </div>

            {/* Target Input */}
            <div className="relative group">
              <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-500">
                <label className="text-white/80 text-sm font-medium mb-3 flex items-center space-x-2">
                  <Target size={16} />
                  <span>What&apos;s your target?</span>
                </label>
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="e.g., New car, Dream vacation, Emergency fund..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300"
                />
                {errors.target && (
                  <p className="text-red-400 text-sm mt-2">{errors.target}</p>
                )}

                {/* AI Suggestions */}
                <div className="mt-4">
                  <p className="text-white/50 text-xs mb-2">
                    {loadingSuggestions
                      ? "AI is thinking..."
                      : aiSuggestions.length > 0 && monthlyIncome
                      ? "AI suggests for your income:"
                      : aiSuggestions.length > 0
                      ? "AI suggests:"
                      : "Popular targets:"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {loadingSuggestions
                      ? // Loading skeleton
                        Array.from({ length: 4 }, (_, index) => (
                          <div
                            key={index}
                            className="h-6 w-16 bg-white/10 rounded-full animate-pulse"
                          />
                        ))
                      : aiSuggestions.length > 0
                      ? // AI generated suggestions
                        aiSuggestions
                          .slice(0, 4)
                          .map((suggestion: string, index: number) => (
                            <button
                              key={index}
                              onClick={() => setTarget(suggestion)}
                              className="text-xs px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/60 hover:text-white hover:border-white/20 transition-all duration-300"
                            >
                              {suggestion}
                            </button>
                          ))
                      : // Default fallback suggestions
                        [
                          "Emergency fund",
                          "New car",
                          "Vacation",
                          "Investment",
                        ].map((suggestion: string, index: number) => (
                          <button
                            key={index}
                            onClick={() => setTarget(suggestion)}
                            className="text-xs px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/60 hover:text-white hover:border-white/20 transition-all duration-300"
                          >
                            {suggestion}
                          </button>
                        ))}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Analysis Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-4"
            >
              <ShimmerButton
                className="w-full py-4 text-lg font-medium"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                background="#ffff"
                shimmerColor="#0a0a0a"
                shimmerSize="0.05em"
              >
                <div className="flex items-center justify-center space-x-3">
                  {isAnalyzing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      >
                        <Brain size={20} className="text-black" />
                      </motion.div>
                      <span className="text-black">AI is analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} className="text-black" />
                      <span className="text-black">Analyze with AI</span>
                    </>
                  )}
                </div>
              </ShimmerButton>
            </motion.div>
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Brain size={16} className="text-white/60 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Our AI will analyze your target and income to create a
                    personalized savings plan with smart recommendations and
                    timeline predictions.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Decorative Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex justify-center mt-12"
          >
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
          </motion.div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
    </div>
  );
}
