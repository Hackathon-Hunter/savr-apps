"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Target,
  Calendar,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Lightbulb,
  PieChart,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Particles from "@/components/reactbits/Particles/Particles";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export default function AnalysisResults() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const recommendations = [
    {
      title: "Optimal Savings Rate",
      description: "Save 15% of your monthly income",
      amount: "$750/month",
      icon: TrendingUp,
      priority: "high",
    },
    {
      title: "Timeline Prediction",
      description: "Reach your goal in 18 months",
      amount: "Feb 2026",
      icon: Calendar,
      priority: "medium",
    },
    {
      title: "Emergency Buffer",
      description: "Build 3-month emergency fund first",
      amount: "$4,500",
      icon: CheckCircle,
      priority: "high",
    },
  ];

  const insights = [
    "Your income allows for aggressive saving while maintaining lifestyle",
    "Consider automating transfers to avoid spending temptation",
    "Track progress monthly to stay motivated and adjust if needed",
    "Look for additional income streams to accelerate timeline",
  ];

  const handleStartPlan = () => {
    // Navigate to dashboard or next step
    console.log("Starting savings plan...");
    router.push("dashboard");
  };

  const handleBack = () => {
    router.back();
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
                      Dream Vacation to Japan
                    </p>
                  </div>
                  <div>
                    <DollarSign
                      size={24}
                      className="text-white/60 mx-auto mb-2"
                    />
                    <p className="text-white/60 text-sm mb-1">Monthly Income</p>
                    <p className="text-white text-xl font-semibold">$5,000</p>
                  </div>
                  <div>
                    <PieChart
                      size={24}
                      className="text-white/60 mx-auto mb-2"
                    />
                    <p className="text-white/60 text-sm mb-1">Estimated Cost</p>
                    <p className="text-white text-xl font-semibold">$12,000</p>
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
              background="#ffff"
              shimmerColor="#0a0a0a"
              shimmerSize="0.05em"
            >
              <div className="flex items-center space-x-3">
                <CheckCircle size={20} className="text-black" />
                <span className="text-black">Start Savings Plan</span>
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
