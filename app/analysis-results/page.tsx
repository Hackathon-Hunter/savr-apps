"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Target,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CheckCircle,
  Lightbulb,
  PieChart,
  ArrowLeft,
  Settings,
  AlertCircle,
  Loader,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Particles from "@/components/reactbits/Particles/Particles";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { useSavingsAnalysis } from "@/contexts/SavingsAnalysisContext";
import { useAuth } from "@/hooks/useAuth";
import { useICPPrice } from "@/contexts/ICPPriceContext";
import { startSaving } from "@/service/icService";
import { StartSavingRequest } from "@/service/backend.did";

export default function AnalysisResults() {
  const router = useRouter();
  const { analysisData, userInput, icpToUsdRate } = useSavingsAnalysis();
  const { actor, isAuthenticated, principal } = useAuth();
  const { formatUSD, formatICP, priceData } = useICPPrice();

  // Loading and error states
  const [isCreatingSaving, setIsCreatingSaving] = useState(false);
  const [createError, setCreateError] = useState<string>("");
  const [createSuccess, setCreateSuccess] = useState(false);

  // Redirect if no analysis data
  useEffect(() => {
    if (!analysisData || !userInput) {
      router.push("/input-target");
    }
  }, [analysisData, userInput, router]);

  // Show loading if no data yet
  if (!analysisData || !userInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>
          <div className="text-gray-800 text-xl font-medium">Loading analysis...</div>
        </div>
      </div>
    );
  }

  const iconMap: {
    [key: string]: React.ComponentType<{ size?: number; className?: string }>;
  } = {
    TrendingUp,
    Calendar,
    CheckCircle,
  };

  const recommendations = analysisData.recommendations.map((rec) => ({
    ...rec,
    icon: iconMap[rec.icon] || TrendingUp,
  }));

  const insights = analysisData.insights;

  const handleStartPlan = async () => {
    if (!actor || !isAuthenticated || !principal) {
      setCreateError("Please connect your wallet first");
      return;
    }

    setIsCreatingSaving(true);
    setCreateError("");
    setCreateSuccess(false);

    try {
      // Use simpler timestamp calculation to avoid overflow
      const now = Date.now();
      const monthsInMs =
        analysisData.timeline.months * 30 * 24 * 60 * 60 * 1000;
      const deadlineMs = now + monthsInMs;

      // Convert to nanoseconds (IC timestamp format)
      const deadlineNs =
        BigInt(Math.floor(deadlineMs / 1000)) * BigInt(1000000000);

      // Convert ICP amounts to e8s with careful precision handling
      const targetE8s = BigInt(
        Math.floor(analysisData.estimatedCost.icp * 100000000)
      );

      // Prepare the request
      const startSavingRequest: StartSavingRequest = {
        savingName: userInput.target,
        principalId: principal,
        amount: targetE8s,
        totalSaving: BigInt(0),
        deadline: deadlineNs,
        priorityLevel: [BigInt(analysisData.priority)],
        savingsRate: [],
        isStaking: [],
      };

      // Call the IC backend
      const result = await startSaving(actor, startSavingRequest);

      if ("Ok" in result) {
        console.log("Saving plan created successfully:", result.Ok);
        setCreateSuccess(true);

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        console.error("Failed to create saving plan:", result.Err);
        setCreateError(result.Err);
      }
    } catch (error) {
      console.error("Error creating saving plan:", error);
      setCreateError(
        error instanceof Error
          ? error.message
          : "Failed to create saving plan. Please try again."
      );
    } finally {
      setIsCreatingSaving(false);
    }
  };

  const handleCustomizePlan = () => {
    console.log("Customizing plan...");
    router.push("customize-plan");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Modern Colorful Background */}
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
            <span className="text-sm font-semibold">Back</span>
          </button>
          <ChevronRight size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600 font-medium">Analysis Results</span>
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
                  <Brain size={36} className="text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-gray-800 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Analysis Complete
              </span>
            </h1>
            <p className="text-gray-700 text-xl font-light max-w-md mx-auto leading-relaxed">
              Based on your target and income, here&apos;s your personalized
              savings strategy
            </p>
            
            {/* ICP Rate Display */}
            <div className="mt-4 flex items-center justify-center space-x-2">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-full px-4 py-2 shadow-sm">
                {priceData.error ? (
                  <div className="flex items-center space-x-2 text-red-500">
                    <AlertCircle size={14} />
                    <span className="text-sm">Price unavailable</span>
                  </div>
                ) : priceData.isLoading && priceData.price === 0 ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                ) : (
                  <>
                    <span className="text-gray-600 text-sm">
                      1 ICP = ${priceData.price.toFixed(2)} USD
                    </span>
                    <div
                      className={`flex items-center space-x-1 text-xs ${
                        priceData.changePercent24h >= 0
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {priceData.changePercent24h >= 0 ? (
                        <TrendingUp size={12} />
                      ) : (
                        <TrendingDown size={12} />
                      )}
                      <span>
                        {Math.abs(priceData.changePercent24h).toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Target Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div className="group">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-purple-500/30 group-hover:to-purple-500/20 transition-all duration-300">
                      <Target size={28} className="text-purple-600" />
                    </div>
                    <p className="text-gray-600 text-sm mb-2">Your Target</p>
                    <p className="text-gray-800 text-2xl font-semibold">
                      {userInput.target}
                    </p>
                  </div>
                  <div className="group">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-blue-500/30 group-hover:to-blue-500/20 transition-all duration-300">
                      <DollarSign size={28} className="text-blue-600" />
                    </div>
                    <p className="text-gray-600 text-sm mb-2">Monthly Income</p>
                    <p className="text-gray-800 text-2xl font-semibold">
                      {formatICP(userInput.monthlyIncome / icpToUsdRate)} ICP
                    </p>
                    <p className="text-gray-500 text-sm">
                      ≈ ${formatICP(userInput.monthlyIncome)} USD
                    </p>
                  </div>
                  <div className="group">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-green-500/30 group-hover:to-green-500/20 transition-all duration-300">
                      <PieChart size={28} className="text-green-600" />
                    </div>
                    <p className="text-gray-600 text-sm mb-2">Estimated Cost</p>
                    <p className="text-gray-800 text-2xl font-semibold">
                      {formatICP(analysisData.estimatedCost.icp)} ICP
                    </p>
                    <p className="text-gray-500 text-sm">
                      ≈ ${formatUSD(analysisData.estimatedCost.icp)} USD
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recommendations Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="bg-gradient-to-r from-gray-800 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Recommendations
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500 h-full">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                        <rec.icon size={24} className="text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-800 font-semibold text-xl">
                          {rec.title}
                        </h3>
                        {rec.priority === "high" && (
                          <span className="text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 px-3 py-1 rounded-full mt-1 inline-block">
                            Priority
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {rec.description}
                    </p>
                    <p className="text-gray-800 text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {rec.amount}
                    </p>
                    {rec.amountUsd && (
                      <p className="text-gray-500 text-sm mt-1">
                        {rec.amountUsd}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="bg-gradient-to-r from-gray-800 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Smart Insights
              </span>
            </h2>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500">
                <div className="space-y-6">
                  {insights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                      className="flex items-start space-x-4 group"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-all duration-300">
                        <Lightbulb size={20} className="text-blue-600" />
                      </div>
                      <p className="text-gray-700 leading-relaxed">{insight}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Success/Error Messages */}
          {createSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 backdrop-blur-xl border border-green-200 rounded-3xl p-6 text-center"
            >
              <p className="text-green-600 font-medium text-lg">
                🎉 Saving plan created successfully! Redirecting to dashboard...
              </p>
            </motion.div>
          )}

          {createError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-gradient-to-r from-red-50 to-pink-50 backdrop-blur-xl border border-red-200 rounded-3xl p-6 text-center"
            >
              <p className="text-red-500 font-medium text-lg">{createError}</p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <ShimmerButton
              className="px-10 py-5 text-xl font-medium rounded-2xl"
              onClick={handleStartPlan}
              disabled={isCreatingSaving}
              background="linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)"
              shimmerColor="#ffffff"
              shimmerSize="0.05em"
            >
              <div className="flex items-center justify-center space-x-4">
                {isCreatingSaving ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <Loader size={24} className="text-white" />
                  </motion.div>
                ) : (
                  <CheckCircle size={24} className="text-white" />
                )}
                <span className="text-white">
                  {isCreatingSaving ? "Creating..." : "Start Savings Plan"}
                </span>
              </div>
            </ShimmerButton>

            <ShimmerButton
              className="px-10 py-5 text-xl font-medium rounded-2xl"
              onClick={handleCustomizePlan}
              background="linear-gradient(135deg, #4b5563 0%, #6b7280 100%)"
              shimmerColor="#ffffff"
              shimmerSize="0.05em"
            >
              <div className="flex items-center justify-center space-x-4">
                <Settings size={24} className="text-white" />
                <span className="text-white">Customize Plan</span>
              </div>
            </ShimmerButton>
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
    </div>
  );
}
