"use client";

import { useState, useEffect } from "react";
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
    <div className="relative min-h-screen w-screen overflow-hidden bg-black">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />

      {/* Mouse Follow Glow */}
      <div
        className="absolute w-96 h-96 rounded-full bg-white/5 blur-3xl transition-all duration-500 ease-out pointer-events-none"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

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
          <ChevronRight size={16} className="text-white/40" />
          <span className="text-sm text-white/60">Customize Plan</span>
        </div>
      </motion.div>

      {/* Particles Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={80}
          particleSpread={5}
          speed={0.04}
          particleBaseSize={80}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 py-20">
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
                className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10"
              >
                <Settings size={40} className="text-white" />
              </motion.div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Customize Your Plan
            </h1>
            <p className="text-white/60 text-lg font-light tracking-wide max-w-2xl mx-auto">
              Adjust the AI recommendations to match your preferences and goals
            </p>
            {/* ICP Rate Display */}
            <div className="mt-4 flex items-center justify-center space-x-2">
              <span className="text-white/40 text-sm">
                1 ICP = ${icpToUsd} USD
              </span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </motion.div>

          {/* Plan Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl opacity-50" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <div className="grid md:grid-cols-4 gap-6 text-center">
                  <div>
                    <Target size={24} className="text-white/60 mx-auto mb-2" />
                    <p className="text-white/60 text-sm mb-1">Target</p>
                    <p className="text-white text-lg font-semibold">
                      {planData.target}
                    </p>
                  </div>
                  <div>
                    <DollarSign
                      size={24}
                      className="text-white/60 mx-auto mb-2"
                    />
                    <p className="text-white/60 text-sm mb-1">Goal Amount</p>
                    <p className="text-white text-lg font-semibold">
                      {formatICP(planData.targetAmount)} ICP
                    </p>
                    <p className="text-white/50 text-sm">
                      ≈ ${formatUSD(planData.targetAmount)} USD
                    </p>
                  </div>
                  <div>
                    <TrendingUp
                      size={24}
                      className="text-white/60 mx-auto mb-2"
                    />
                    <p className="text-white/60 text-sm mb-1">
                      Monthly Savings
                    </p>
                    <p className="text-white text-lg font-semibold">
                      {calculateMonthlyAmount()} ICP
                    </p>
                    <p className="text-white/50 text-sm">
                      ≈ $
                      {formatUSD(Number.parseFloat(calculateMonthlyAmount()))}{" "}
                      USD
                    </p>
                  </div>
                  <div>
                    <Calendar
                      size={24}
                      className="text-white/60 mx-auto mb-2"
                    />
                    <p className="text-white/60 text-sm mb-1">Timeline</p>
                    <p className="text-white text-lg font-semibold">
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
              <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-500">
                <label className="text-white/80 text-sm font-medium mb-4 flex items-center space-x-2">
                  <Target size={16} />
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300"
                />
                <p className="text-white/40 text-sm mt-2">
                  ≈ ${formatUSD(planData.targetAmount)} USD
                </p>
              </div>
            </div>

            {/* Monthly Income */}
            <div className="relative group">
              <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-500">
                <label className="text-white/80 text-sm font-medium mb-4 flex items-center space-x-2">
                  <DollarSign size={16} />
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300"
                />
                <p className="text-white/40 text-sm mt-2">
                  ≈ ${formatUSD(planData.monthlyIncome)} USD
                </p>
              </div>
            </div>

            {/* Savings Rate Slider */}
            <div className="relative group">
              <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-500">
                <label className="text-white/80 text-sm font-medium mb-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Slider size={16} />
                    <span>Savings Rate</span>
                  </div>
                  <span className="text-white font-semibold">
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
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-white/40 text-xs mt-2">
                  <span>5%</span>
                  <span>Conservative</span>
                  <span>Aggressive</span>
                  <span>50%</span>
                </div>
                <p className="text-white/40 text-sm mt-2">
                  Monthly: {calculateMonthlyAmount()} ICP (≈ $
                  {formatUSD(Number.parseFloat(calculateMonthlyAmount()))} USD)
                </p>
              </div>
            </div>

            {/* Priority Level */}
            <div className="relative group">
              <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-500">
                <label className="text-white/80 text-sm font-medium mb-4 flex items-center space-x-2">
                  <Clock size={16} />
                  <span>Priority Level</span>
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {["low", "medium", "high"].map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setPlanData({ ...planData, priority })}
                      className={`p-3 rounded-xl border transition-all duration-300 ${
                        planData.priority === priority
                          ? "bg-white/10 border-white/30 text-white"
                          : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
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
              <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-500">
                <h3 className="text-white/80 text-sm font-medium mb-4">
                  Additional Options
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
                      className="w-5 h-5 rounded border-white/20 bg-white/5 text-white focus:ring-white/20"
                    />
                    <span className="text-white/70">
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
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
          >
            <ShimmerButton
              className="px-8 py-4 text-lg font-medium"
              onClick={handleSave}
              background="#ffffff"
              shimmerColor="#000000"
              shimmerSize="0.05em"
            >
              <div className="flex items-center space-x-3">
                <Save size={20} className="text-black" />
                <span className="text-black">Save Changes</span>
              </div>
            </ShimmerButton>

            <ShimmerButton
              className="px-8 py-4 text-lg font-medium"
              onClick={handleReset}
              background="#1f2937"
              shimmerColor="#ffffff"
              shimmerSize="0.05em"
            >
              <div className="flex items-center space-x-3">
                <RotateCcw size={20} className="text-white" />
                <span className="text-white">Reset to AI</span>
              </div>
            </ShimmerButton>
          </motion.div>

          {/* Bottom Decorative Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
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
