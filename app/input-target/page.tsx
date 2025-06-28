"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
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
import { getSuggestions } from "@/lib/getSuggestions";
import { getAnalyzeResult } from "@/lib/getAnalyze";

export default function InputTarget() {
  const router = useRouter();
  const { setAnalysisData, setUserInput, icpToUsdRate } = useSavingsAnalysis();
  const [target, setTarget] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errors, setErrors] = useState({ target: "", income: "" });
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [showLoader, setShowLoader] = useState(false);

  // Load initial AI suggestions on page load
  useEffect(() => {
    const fetchInitialSuggestions = async () => {
      setLoadingSuggestions(true);
      const data = await getSuggestions(Number(monthlyIncome));

      setAiSuggestions(data || []);
      setLoadingSuggestions(false);
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

    setIsAnalyzing(true);
    setShowLoader(true);
    const loaderStartTime = Date.now();

    try {
      // Store user input
      const monthlyIncomeUsd = Number(monthlyIncome);
      setUserInput({
        target,
        monthlyIncome: monthlyIncomeUsd,
      });

      // Get AI analysis from ChatGPT via API
      const analysis = await getAnalyzeResult(
        target,
        monthlyIncomeUsd,
        icpToUsdRate
      );

      setAnalysisData(analysis);

      // Keep the loader visible for a moment before navigating
      // Ensure the loader is visible for at least 2 seconds for better UX
      const minLoaderTime = 2000;
      const timeElapsed = Date.now() - loaderStartTime;
      const remainingTime = Math.max(0, minLoaderTime - timeElapsed);

      setTimeout(() => {
        setIsAnalyzing(false);
        setShowLoader(false);
        router.push("analysis-results");
      }, remainingTime);
    } catch (error) {
      console.error("Error during analysis:", error);
      setIsAnalyzing(false);
      setShowLoader(false);
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
      setLoadingSuggestions(true);
      const data = await getSuggestions(Number(monthlyIncome));

      setAiSuggestions(data || []);
      setLoadingSuggestions(false);
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
    <div className="relative min-h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Modern Colorful Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-green-400/15 to-emerald-400/15 rounded-full blur-3xl" />

      {/* Modern Breadcrumb Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-8 left-8 z-20"
      >
        <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl px-6 py-3 shadow-lg shadow-purple-500/5">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors duration-300 group"
          >
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 group-hover:bg-purple-500/20 group-hover:text-purple-700 transition-all duration-300">
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform duration-300"
              />
            </div>
            <span className="text-sm font-semibold">Dashboard</span>
          </button>
          <ChevronRight size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600 font-medium">
            Input Savings
          </span>
        </div>
      </motion.div>

      {/* Colorful Particles Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#8b5cf6", "#06b6d4", "#ec4899", "#f59e0b"]}
          particleCount={40}
          particleSpread={8}
          speed={0.015}
          particleBaseSize={30}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex justify-center items-center min-h-screen px-4 py-20">
        <div className="w-full max-w-[80%]">
          {/* Modern Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
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
                  onChange={(e) => setTarget(e.target.value)}
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
                      {loadingSuggestions
                        ? "AI is thinking..."
                        : aiSuggestions.length > 0 && monthlyIncome
                        ? "AI suggests for your income:"
                        : aiSuggestions.length > 0
                        ? "AI suggests:"
                        : "Popular targets:"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {loadingSuggestions
                      ? // Modern Loading skeleton
                        Array.from({ length: 4 }, (_, index) => (
                          <div
                            key={index}
                            className="h-10 w-20 bg-gradient-to-r from-blue-200/60 to-cyan-200/60 rounded-2xl animate-pulse"
                          />
                        ))
                      : aiSuggestions.length > 0
                      ? // Modern AI generated suggestions
                        aiSuggestions
                          .slice(0, 6)
                          .map((suggestion: string, index: number) => (
                            <button
                              key={index}
                              onClick={() => setTarget(suggestion)}
                              className="px-4 py-2 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/50 rounded-2xl text-blue-700 text-sm font-medium hover:from-blue-100 hover:to-cyan-100 hover:border-blue-300 hover:text-blue-800 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
                            >
                              {suggestion}
                            </button>
                          ))
                      : // Modern Default fallback suggestions
                        [
                          "Emergency fund",
                          "New car",
                          "Dream vacation",
                          "Investment account",
                          "Home down payment",
                          "Education fund",
                        ].map((suggestion: string, index: number) => (
                          <button
                            key={index}
                            onClick={() => setTarget(suggestion)}
                            className="px-4 py-2 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/50 rounded-2xl text-blue-700 text-sm font-medium hover:from-blue-100 hover:to-cyan-100 hover:border-blue-300 hover:text-blue-800 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
                          >
                            {suggestion}
                          </button>
                        ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modern AI Analysis Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-4"
            >
              <ShimmerButton
                className="w-full py-5 text-xl font-semibold"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                background="linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)"
                shimmerColor="#ffffff"
                shimmerSize="0.05em"
              >
                <div className="flex items-center justify-center space-x-4">
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
                        <Brain size={24} className="text-white" />
                      </motion.div>
                      <span className="text-white">AI is analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={24} className="text-white" />
                      <span className="text-white">Analyze with AI</span>
                    </>
                  )}
                </div>
              </ShimmerButton>
            </motion.div>
          </motion.div>

          {/* Modern Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-amber-400/10 rounded-3xl blur-xl opacity-60"></div>
              <div className="relative bg-white/80 backdrop-blur-xl border border-orange-200/50 rounded-3xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Brain size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-800 font-semibold text-lg mb-2 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                      AI-Powered Analysis
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Our advanced AI will analyze your target and income to
                      create a personalized savings plan with smart
                      recommendations, timeline predictions, and optimized
                      strategies for your financial goals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Modern Bottom Decorative Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex justify-center mt-12"
          >
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
              <div className="w-32 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 rounded-full" />
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse delay-300"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modern Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/80 via-slate-50/20 to-transparent pointer-events-none" />

      {/* ICP Loader Overlay */}
      {showLoader && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: [0, 5, -5, 3, -3, 0],
              y: [0, -10, 0, -7, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="relative"
          >
            <Image
              src="/icp-loader.svg"
              alt="Loading"
              width={100}
              height={100}
              className="transform"
              priority
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-16 text-white text-center"
          >
            <p className="text-xl font-medium">AI Analysis in progress...</p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
