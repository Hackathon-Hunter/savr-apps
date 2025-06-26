"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Target,
  Calendar,
  DollarSign,
  TrendingUp,
  ArrowLeft,
  ChevronRight,
  Save,
  RotateCcw,
  FileSlidersIcon as Slider,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Particles from "@/components/reactbits/Particles/Particles";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export default function CustomizePlan() {
  const router = useRouter();

  // Mock ICP to USD conversion rate (this would come from an API in real app)
  const icpToUsd = 12.45; // Example rate: 1 ICP = $12.45 USD

  // Form state (converted to ICP)
  const [planData, setPlanData] = useState({
    target: "Dream Vacation to Japan",
    targetAmount: 963.86, // ~$12,000 in ICP
    monthlyIncome: 401.61, // ~$5,000 in ICP
    savingsRate: 15,
    timeline: 18,
    priority: "medium",
    autoTransfer: true,
    emergencyBuffer: true,
  });

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    // Validate and save plan
    console.log("Saving customized plan:", planData);
    router.push("/dashboard");
  };

  const handleReset = () => {
    // Reset to AI recommendations
    setPlanData({
      target: "Dream Vacation to Japan",
      targetAmount: 963.86,
      monthlyIncome: 401.61,
      savingsRate: 15,
      timeline: 18,
      priority: "medium",
      autoTransfer: true,
      emergencyBuffer: true,
    });
  };

  const calculateMonthlyAmount = () => {
    return ((planData.monthlyIncome * planData.savingsRate) / 100).toFixed(2);
  };

  const calculateNewTimeline = () => {
    const monthlyAmount = Number.parseFloat(calculateMonthlyAmount());
    return Math.ceil(planData.targetAmount / monthlyAmount);
  };

  const formatICP = (amount: number) => {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatUSD = (icpAmount: number) => {
    return (icpAmount * icpToUsd).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
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
          <span className="text-sm text-gray-600 font-medium">Customize Plan</span>
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
                  <Settings size={36} className="text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-gray-800 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Customize Your Plan
              </span>
            </h1>
            <p className="text-gray-700 text-xl font-light max-w-md mx-auto leading-relaxed">
              Adjust the AI recommendations to match your preferences and goals
            </p>
            {/* ICP Rate Display */}
            <div className="mt-4 flex items-center justify-center space-x-2">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-full px-4 py-2 shadow-sm">
                <span className="text-gray-600 text-sm">
                  1 ICP = ${icpToUsd} USD
                </span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </motion.div>

          {/* Plan Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500">
                <div className="grid md:grid-cols-4 gap-8 text-center">
                  <div className="group">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-purple-500/30 group-hover:to-purple-500/20 transition-all duration-300">
                      <Target size={28} className="text-purple-600" />
                    </div>
                    <p className="text-gray-600 text-sm mb-2">Target</p>
                    <p className="text-gray-800 text-xl font-semibold">
                      {planData.target}
                    </p>
                  </div>
                  <div className="group">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-blue-500/30 group-hover:to-blue-500/20 transition-all duration-300">
                      <DollarSign size={28} className="text-blue-600" />
                    </div>
                    <p className="text-gray-600 text-sm mb-2">Goal Amount</p>
                    <p className="text-gray-800 text-xl font-semibold">
                      {formatICP(planData.targetAmount)} ICP
                    </p>
                    <p className="text-gray-500 text-sm">
                      ≈ ${formatUSD(planData.targetAmount)} USD
                    </p>
                  </div>
                  <div className="group">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-green-500/30 group-hover:to-green-500/20 transition-all duration-300">
                      <TrendingUp size={28} className="text-green-600" />
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      Monthly Savings
                    </p>
                    <p className="text-gray-800 text-xl font-semibold">
                      {calculateMonthlyAmount()} ICP
                    </p>
                    <p className="text-gray-500 text-sm">
                      ≈ $
                      {formatUSD(Number.parseFloat(calculateMonthlyAmount()))}{" "}
                      USD
                    </p>
                  </div>
                  <div className="group">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-orange-500/30 group-hover:to-orange-500/20 transition-all duration-300">
                      <Calendar size={28} className="text-orange-600" />
                    </div>
                    <p className="text-gray-600 text-sm mb-2">Timeline</p>
                    <p className="text-gray-800 text-xl font-semibold">
                      {calculateNewTimeline()} months
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Customization Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Target Amount */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500">
                <label className="text-gray-800 text-lg font-semibold mb-4 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Target size={18} className="text-white" />
                  </div>
                  <span>Target Amount (ICP)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={planData.targetAmount}
                  onChange={(e) =>
                    setPlanData({
                      ...planData,
                      targetAmount: Number(e.target.value),
                    })
                  }
                  className="w-full bg-gradient-to-br from-purple-50/80 to-pink-50/80 border border-purple-200/50 rounded-2xl px-6 py-4 text-gray-800 text-lg placeholder:text-gray-400 focus:outline-none focus:border-purple-400 focus:bg-purple-50 focus:shadow-lg focus:shadow-purple-500/10 transition-all duration-300"
                />
                <p className="text-gray-500 text-sm mt-3">
                  ≈ ${formatUSD(planData.targetAmount)} USD
                </p>
              </div>
            </div>

            {/* Monthly Income */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500">
                <label className="text-gray-800 text-lg font-semibold mb-4 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <DollarSign size={18} className="text-white" />
                  </div>
                  <span>Monthly Income (ICP)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={planData.monthlyIncome}
                  onChange={(e) =>
                    setPlanData({
                      ...planData,
                      monthlyIncome: Number(e.target.value),
                    })
                  }
                  className="w-full bg-gradient-to-br from-blue-50/80 to-cyan-50/80 border border-blue-200/50 rounded-2xl px-6 py-4 text-gray-800 text-lg placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:bg-blue-50 focus:shadow-lg focus:shadow-blue-500/10 transition-all duration-300"
                />
                <p className="text-gray-500 text-sm mt-3">
                  ≈ ${formatUSD(planData.monthlyIncome)} USD
                </p>
              </div>
            </div>

            {/* Savings Rate Slider */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 hover:border-green-300 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-500">
                <label className="text-gray-800 text-lg font-semibold mb-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Slider size={18} className="text-white" />
                    </div>
                    <span>Savings Rate</span>
                  </div>
                  <span className="text-green-600 font-semibold">
                    {planData.savingsRate}%
                  </span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={planData.savingsRate}
                  onChange={(e) =>
                    setPlanData({
                      ...planData,
                      savingsRate: Number(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gradient-to-r from-green-200 to-emerald-300 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-gray-500 text-xs mt-3">
                  <span>5%</span>
                  <span>Conservative</span>
                  <span>Aggressive</span>
                  <span>50%</span>
                </div>
                <p className="text-gray-500 text-sm mt-3">
                  Monthly: {calculateMonthlyAmount()} ICP (≈ $
                  {formatUSD(Number.parseFloat(calculateMonthlyAmount()))} USD)
                </p>
              </div>
            </div>

            {/* Priority Level */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-amber-400/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500">
                <label className="text-gray-800 text-lg font-semibold mb-4 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                    <Clock size={18} className="text-white" />
                  </div>
                  <span>Priority Level</span>
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {["low", "medium", "high"].map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setPlanData({ ...planData, priority })}
                      className={`p-4 rounded-2xl border transition-all duration-300 ${
                        planData.priority === priority
                          ? "bg-gradient-to-br from-orange-100 to-amber-100 border-orange-300 text-orange-700 font-medium shadow-md shadow-orange-500/10"
                          : "bg-white/60 border-gray-200 text-gray-600 hover:border-orange-200 hover:bg-orange-50/50"
                      }`}
                    >
                      <span className="capitalize">{priority}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500">
                <h3 className="text-gray-800 text-lg font-semibold mb-4 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Settings size={18} className="text-white" />
                  </div>
                  <span>Additional Options</span>
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={planData.emergencyBuffer}
                      onChange={(e) =>
                        setPlanData({
                          ...planData,
                          emergencyBuffer: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded border-purple-200 bg-purple-50 text-purple-600 focus:ring-purple-200"
                    />
                    <span className="text-gray-700">
                      Enable ICP staking rewards (8.5% APY)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12"
          >
            <ShimmerButton
              className="px-10 py-5 text-xl font-medium rounded-2xl"
              onClick={handleSave}
              background="linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)"
              shimmerColor="#ffffff"
              shimmerSize="0.05em"
            >
              <div className="flex items-center justify-center space-x-4">
                <Save size={24} className="text-white" />
                <span className="text-white">Save Changes</span>
              </div>
            </ShimmerButton>

            <ShimmerButton
              className="px-10 py-5 text-xl font-medium rounded-2xl"
              onClick={handleReset}
              background="linear-gradient(135deg, #4b5563 0%, #6b7280 100%)"
              shimmerColor="#ffffff"
              shimmerSize="0.05em"
            >
              <div className="flex items-center justify-center space-x-4">
                <RotateCcw size={24} className="text-white" />
                <span className="text-white">Reset to AI</span>
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
