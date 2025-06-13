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
      router.push('/input-target');
    }
  }, [analysisData, userInput, router]);

  // Show loading if no data yet
  if (!analysisData || !userInput) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading analysis...</div>
      </div>
    );
  }

  const iconMap: { [key: string]: React.ComponentType<{ size?: number; className?: string }> } = {
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
      const monthsInMs = analysisData.timeline.months * 30 * 24 * 60 * 60 * 1000;
      const deadlineMs = now + monthsInMs;

      // Convert to nanoseconds (IC timestamp format)
      const deadlineNs = BigInt(Math.floor(deadlineMs / 1000)) * BigInt(1000000000);

      // Convert ICP amounts to e8s with careful precision handling
      const targetE8s = BigInt(Math.floor(analysisData.estimatedCost.icp * 100000000));

      // Prepare the request
      const startSavingRequest: StartSavingRequest = {
        savingName: userInput.target,
        principalId: principal,
        amount: targetE8s,
        totalSaving: BigInt(0),
        deadline: deadlineNs,
        priorityLevel: [],
        savingsRate: [],
        isStaking: [],
      };

      console.log("Creating saving plan:", {
        savingName: startSavingRequest.savingName,
        principalId: startSavingRequest.principalId,
        amount: startSavingRequest.amount.toString(),
        deadline: startSavingRequest.deadline.toString(),
      });

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
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>
      </motion.div>

      {/* Particles Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={100}
          particleSpread={6}
          speed={0.05}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10 relative"
              >
                <Brain size={40} className="text-white" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute inset-0 bg-white/5 rounded-2xl"
                />
              </motion.div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              AI Analysis Complete
            </h1>
            <p className="text-white/60 text-lg font-light tracking-wide max-w-2xl mx-auto">
              Based on your target and income, here&apos;s your personalized savings
              strategy
            </p>
            {/* ICP Rate Display */}
            <div className="mt-4 flex items-center justify-center space-x-2">
              {priceData.error ? (
                <div className="flex items-center space-x-2 text-red-400">
                  <AlertCircle size={14} />
                  <span className="text-sm">Price unavailable</span>
                </div>
              ) : priceData.isLoading && priceData.price === 0 ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-white/10 rounded w-32"></div>
                </div>
              ) : (
                <>
                  <span className="text-white/40 text-sm">
                    1 ICP = ${priceData.price.toFixed(2)} USD
                  </span>
                  <div
                    className={`flex items-center space-x-1 text-xs ${
                      priceData.changePercent24h >= 0
                        ? "text-green-400"
                        : "text-red-400"
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
          </motion.div>

          {/* Target Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl opacity-50" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <Target size={24} className="text-white/60 mx-auto mb-2" />
                    <p className="text-white/60 text-sm mb-1">Your Target</p>
                    <p className="text-white text-xl font-semibold">
                      {userInput.target}
                    </p>
                  </div>
                  <div>
                    <DollarSign
                      size={24}
                      className="text-white/60 mx-auto mb-2"
                    />
                    <p className="text-white/60 text-sm mb-1">Monthly Income</p>
                    <p className="text-white text-xl font-semibold">
                      {formatICP((userInput.monthlyIncome / icpToUsdRate))} ICP
                    </p>
                    <p className="text-white/50 text-sm">
                      ≈ ${formatUSD((userInput.monthlyIncome / icpToUsdRate))} USD
                    </p>
                  </div>
                  <div>
                    <PieChart
                      size={24}
                      className="text-white/60 mx-auto mb-2"
                    />
                    <p className="text-white/60 text-sm mb-1">Estimated Cost</p>
                    <p className="text-white text-xl font-semibold">
                      {formatICP(analysisData.estimatedCost.icp)} ICP
                    </p>
                    <p className="text-white/50 text-sm">
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
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              AI Recommendations
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-500 h-full">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <rec.icon size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg">
                          {rec.title}
                        </h3>
                        {rec.priority === "high" && (
                          <span className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded-full">
                            Priority
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-white/70 text-sm mb-3">
                      {rec.description}
                    </p>
                    <p className="text-white text-xl font-bold">{rec.amount}</p>
                    {rec.amountUsd && (
                      <p className="text-white/50 text-sm mt-1">
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
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Smart Insights
            </h2>
            <div className="relative group">
              <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-50" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <div className="space-y-4">
                  {insights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <Lightbulb
                        size={16}
                        className="text-white/60 mt-1 flex-shrink-0"
                      />
                      <p className="text-white/80 leading-relaxed">{insight}</p>
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
              className="mb-6 bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-center"
            >
              <p className="text-green-400 font-medium">
                🎉 Saving plan created successfully! Redirecting to dashboard...
              </p>
            </motion.div>
          )}

          {createError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-center"
            >
              <p className="text-red-400 font-medium">{createError}</p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <ShimmerButton
              className="px-8 py-4 text-lg font-medium"
              onClick={handleStartPlan}
              disabled={isCreatingSaving}
              background="#ffffff"
              shimmerColor="#000000"
              shimmerSize="0.05em"
            >
              <div className="flex items-center space-x-3">
                {isCreatingSaving ? (
                  <Loader size={20} className="text-black animate-spin" />
                ) : (
                  <CheckCircle size={20} className="text-black" />
                )}
                <span className="text-black">
                  {isCreatingSaving ? "Creating..." : "Start Savings Plan"}
                </span>
              </div>
            </ShimmerButton>

            <ShimmerButton
              className="px-8 py-4 text-lg font-medium"
              onClick={handleCustomizePlan}
              background="#1f2937"
              shimmerColor="#ffffff"
              shimmerSize="0.05em"
            >
              <div className="flex items-center space-x-3">
                <Settings size={20} className="text-white" />
                <span className="text-white">Customize Plan</span>
              </div>
            </ShimmerButton>
          </motion.div>

          {/* Bottom Decorative Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="flex justify-center mt-16"
          >
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
          </motion.div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
    </div>
  );
}
