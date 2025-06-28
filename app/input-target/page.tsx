"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Target,
  DollarSign,
  Brain,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Particles from "@/components/reactbits/Particles/Particles";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { useSavingsAnalysis } from "@/contexts/SavingsAnalysisContext";

export default function InputTarget() {
  const router = useRouter();
  const { 
    analyzeTarget, 
    loadSuggestions, 
    suggestions, 
    isAnalyzing, 
    isLoadingSuggestions,
    analysisError,
    suggestionsError,
    icpToUsdRate 
  } = useSavingsAnalysis();
  
  const [target, setTarget] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [errors, setErrors] = useState({ target: "", income: "" });
  const [showLoader, setShowLoader] = useState(false);

  // Load initial AI suggestions on page load
  useEffect(() => {
    console.log('============================adasdnakjsndjkanjk, 37')
    const fetchInitialSuggestions = async () => {
      try {
        await loadSuggestions(5000); // Use average income for initial suggestions
      } catch (error) {
        console.error("Error fetching initial suggestions:", error);
      }
    };

    fetchInitialSuggestions();
  }, []);

  // Update suggestions when income changes
  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMonthlyIncome(value);
    
    // Clear income error when user starts typing
    if (errors.income) {
      setErrors(prev => ({ ...prev, income: "" }));
    }
  };

  const handleOnBlurIncome = async () => {
    const income = Number(monthlyIncome);
    if (income > 0) {
      try {
        await loadSuggestions(income);
      } catch (error) {
        console.error("Error loading income-based suggestions:", error);
      }
    }
  };

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

    setShowLoader(true);
    const loaderStartTime = Date.now();

    try {
      const monthlyIncomeUsd = Number(monthlyIncome);
      
      // Use the context's analyzeTarget function
      await analyzeTarget(target, monthlyIncomeUsd, icpToUsdRate);

      // Keep the loader visible for a moment before navigating
      // Ensure the loader is visible for at least 2 seconds for better UX
      const minLoaderTime = 2000;
      const timeElapsed = Date.now() - loaderStartTime;
      const remainingTime = Math.max(0, minLoaderTime - timeElapsed);
      
      setTimeout(() => {
        setShowLoader(false);
        router.push("analysis-results");
      }, remainingTime);
    } catch (error) {
      console.error("Error during analysis:", error);
      setShowLoader(false);
      // Show error message to the user
      alert(
        "Sorry, there was an error analyzing your savings goal. Please try again."
      );
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTarget(suggestion);
    // Clear target error when user selects a suggestion
    if (errors.target) {
      setErrors(prev => ({ ...prev, target: "" }));
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Show loader overlay
  if (showLoader || isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center relative overflow-hidden">
        <Particles className="absolute inset-0 opacity-40" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center z-10 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl p-12 shadow-2xl shadow-purple-500/20"
        >
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl opacity-60"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-xl shadow-purple-500/20 mx-auto">
              <Brain size={36} className="text-white animate-pulse" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI is Analyzing
            </span>
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Creating your personalized savings strategy...
          </p>
          
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 relative overflow-hidden">
      <Particles className="absolute inset-0 opacity-40" />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mb-8"
        >
          <button
            onClick={handleBack}
            className="group flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors duration-300 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl px-4 py-3 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/10"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Back</span>
          </button>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl opacity-60"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-xl shadow-purple-500/20">
                  <Target size={36} className="text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-gray-800 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Set Your Target
              </span>
            </h1>
            <p className="text-gray-700 text-xl font-light max-w-md mx-auto leading-relaxed">
              Tell us your goal and let AI create your savings plan
            </p>
          </motion.div>

          {/* Modern Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Modern Monthly Income Input */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 hover:border-green-300 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-500">
                <label className="text-gray-800 text-lg font-semibold mb-4 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <DollarSign size={18} className="text-white" />
                  </div>
                  <span>Monthly Income</span>
                </label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-semibold">
                    $
                  </span>
                  <input
                    type="number"
                    autoFocus
                    value={monthlyIncome}
                    onChange={handleIncomeChange}
                    onBlur={handleOnBlurIncome}
                    placeholder="5000"
                    className="w-full bg-gradient-to-br from-green-50/80 to-emerald-50/80 border border-green-200/50 rounded-2xl pl-12 pr-6 py-4 text-gray-800 text-lg placeholder:text-gray-400 focus:outline-none focus:border-green-400 focus:bg-green-50 focus:shadow-lg focus:shadow-green-500/10 transition-all duration-300"
                  />
                </div>
                {errors.income && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-3 font-medium flex items-center space-x-2"
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>{errors.income}</span>
                  </motion.p>
                )}
              </div>
            </div>

            {/* Modern Target Input */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500">
                <label className="text-gray-800 text-lg font-semibold mb-4 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Target size={18} className="text-white" />
                  </div>
                  <span>What&apos;s your target?</span>
                </label>
                <input
                  type="text"
                  value={target}
                  onChange={(e) => {
                    setTarget(e.target.value);
                    // Clear target error when user starts typing
                    if (errors.target) {
                      setErrors(prev => ({ ...prev, target: "" }));
                    }
                  }}
                  placeholder="e.g., New car, Dream vacation, Emergency fund..."
                  className="w-full bg-gradient-to-br from-purple-50/80 to-pink-50/80 border border-purple-200/50 rounded-2xl px-6 py-4 text-gray-800 text-lg placeholder:text-gray-400 focus:outline-none focus:border-purple-400 focus:bg-purple-50 focus:shadow-lg focus:shadow-purple-500/10 transition-all duration-300"
                />
                {errors.target && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-3 font-medium flex items-center space-x-2"
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>{errors.target}</span>
                  </motion.p>
                )}

                {/* Modern AI Suggestions */}
                <div className="mt-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Brain size={14} className="text-white" />
                    </div>
                    <p className="text-gray-700 text-sm font-semibold">
                      {isLoadingSuggestions
                        ? "AI is thinking..."
                        : suggestions.length > 0 && monthlyIncome
                        ? "AI suggests for your income:"
                        : suggestions.length > 0
                        ? "AI suggests:"
                        : "Popular targets:"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {isLoadingSuggestions
                      ? // Modern Loading skeleton
                        Array.from({ length: 4 }, (_, index) => (
                          <div
                            key={index}
                            className="h-10 w-20 bg-gradient-to-r from-blue-200/60 to-cyan-200/60 rounded-2xl animate-pulse"
                          />
                        ))
                      : suggestions.length > 0
                      ? suggestions.map((suggestion, index) => (
                          <motion.button
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="group relative px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border border-blue-200/50 rounded-2xl text-blue-700 text-sm font-medium transition-all duration-300 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10"
                          >
                            <span className="relative z-10">{suggestion}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 rounded-2xl transition-all duration-300" />
                          </motion.button>
                        ))
                      : // Fallback suggestions if AI fails
                        [
                          "Emergency fund",
                          "New car",
                          "Dream vacation",
                          "Investment fund",
                        ].map((suggestion, index) => (
                          <motion.button
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="group relative px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border border-gray-200/50 rounded-2xl text-gray-700 text-sm font-medium transition-all duration-300 hover:border-gray-300 hover:shadow-lg"
                          >
                            <span className="relative z-10">{suggestion}</span>
                          </motion.button>
                        ))}
                  </div>
                  
                  {/* Show error if suggestions failed to load */}
                  {suggestionsError && (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-amber-600 text-sm mt-3 font-medium flex items-center space-x-2"
                    >
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span>Using fallback suggestions</span>
                    </motion.p>
                  )}
                </div>
              </div>
            </div>

            {/* Analyze Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex justify-center pt-4"
            >
              <ShimmerButton
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="group relative w-full md:w-auto"
              >
                <div className="flex items-center justify-center space-x-3 px-8 py-4">
                  <Brain
                    size={20}
                    className="group-hover:rotate-12 transition-transform duration-300"
                  />
                  <span className="text-lg font-semibold">
                    {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
                  </span>
                  <ChevronRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </div>
              </ShimmerButton>
            </motion.div>
            
            {/* Show analysis error if any */}
            {analysisError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl"
              >
                <p className="text-red-600 text-sm font-medium flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>{analysisError}</span>
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}