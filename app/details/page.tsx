"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Calendar,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Award,
  Plus,
  ArrowLeft,
  X,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Particles from "@/components/reactbits/Particles/Particles";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export default function SavingsPlanDetails() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showConfetti, setShowConfetti] = useState(true);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState("");

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Hide confetti after a few seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timer);
    };
  }, []);

  // Simulated data
  const savingsGoal = {
    target: "Dream Vacation to Japan",
    totalAmount: 12000,
    currentSaved: 2400,
    monthlyTarget: 750,
    timelineMonths: 18,
    nextMilestone: "First $1,000 saved",
    startDate: new Date().toLocaleDateString(),
    targetDate: "February 2026",
  };

  const handleBack = () => {
    router.push("/dashboard");
  };

  const handleTopUp = () => {
    setShowTopUpModal(true);
  };

  const validateAmount = () => {
    if (!topUpAmount.trim()) {
      setErrors("Please enter an amount");
      return false;
    }
    if (isNaN(Number(topUpAmount)) || Number(topUpAmount) <= 0) {
      setErrors("Please enter a valid amount");
      return false;
    }
    if (Number(topUpAmount) > 10000) {
      setErrors("Maximum transfer amount is $10,000");
      return false;
    }
    setErrors("");
    return true;
  };

  const handleConfirmTopUp = () => {
    if (!validateAmount()) return;
    setShowTopUpModal(false);
    setShowConfirmation(true);
  };

  const handleFinalConfirm = () => {
    // Simulate transfer
    console.log(`Transferring $${topUpAmount} to savings`);
    setShowConfirmation(false);
    setTopUpAmount("");
    // Here you would update the savings amount
  };

  const handleCancel = () => {
    setShowTopUpModal(false);
    setShowConfirmation(false);
    setTopUpAmount("");
    setErrors("");
  };

  const progressPercentage = Math.round(
    (savingsGoal.currentSaved / savingsGoal.totalAmount) * 100
  );

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
          <span className="text-sm text-white/60">Savings Plan Details</span>
        </div>
      </motion.div>

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x:
                  typeof window !== "undefined"
                    ? Math.random() * window.innerWidth
                    : Math.random() * 1200,
                y: -20,
                opacity: 1,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                y:
                  typeof window !== "undefined" ? window.innerHeight + 20 : 800,
                opacity: 0,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: Math.random() * 2 + 3,
                ease: "easeOut",
                delay: Math.random() * 2,
              }}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor:
                  i % 2 === 0
                    ? "rgba(255, 255, 255, 0.8)"
                    : "rgba(255, 255, 255, 0.5)",
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 px-4 py-20">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20 mx-auto mb-6"
            >
              <Target size={40} className="text-white" />
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              {savingsGoal.target}
            </h1>
            <p className="text-white/60 text-lg font-light tracking-wide max-w-2xl mx-auto">
              Track your progress and manage your savings
            </p>
          </motion.div>

          {/* Dashboard Header */}
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
                    <p className="text-white text-xl font-semibold">
                      {savingsGoal.target}
                    </p>
                  </div>
                  <div>
                    <DollarSign
                      size={24}
                      className="text-white/60 mx-auto mb-2"
                    />
                    <p className="text-white/60 text-sm mb-1">Goal Amount</p>
                    <p className="text-white text-xl font-semibold">
                      ${savingsGoal.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Calendar
                      size={24}
                      className="text-white/60 mx-auto mb-2"
                    />
                    <p className="text-white/60 text-sm mb-1">Target Date</p>
                    <p className="text-white text-xl font-semibold">
                      {savingsGoal.targetDate}
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
                    <p className="text-white text-xl font-semibold">
                      ${savingsGoal.monthlyTarget}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Progress Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Progress Tracker
            </h2>
            <div className="relative group">
              <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-50" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/60 text-sm">
                      ${savingsGoal.currentSaved.toLocaleString()}
                    </span>
                    <span className="text-white font-medium">
                      {progressPercentage}%
                    </span>
                    <span className="text-white/60 text-sm">
                      ${savingsGoal.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-white/60 text-xs mb-1">
                      Current Savings
                    </p>
                    <p className="text-white text-2xl font-bold">
                      ${savingsGoal.currentSaved.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-white/60 text-xs mb-1">Remaining</p>
                    <p className="text-white text-2xl font-bold">
                      $
                      {(
                        savingsGoal.totalAmount - savingsGoal.currentSaved
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-white/60 text-xs mb-1">Next Milestone</p>
                    <p className="text-white text-lg font-medium">
                      {savingsGoal.nextMilestone}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-white/60 text-xs mb-1">Time Remaining</p>
                    <p className="text-white text-lg font-medium">
                      {savingsGoal.timelineMonths} months
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Top Up Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Add to Savings
            </h2>
            <div className="relative group">
              <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-50" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
                <Plus size={32} className="text-white/80 mx-auto mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">
                  Top Up Your Savings
                </h3>
                <p className="text-white/70 max-w-2xl mx-auto mb-8">
                  Add money to your savings plan anytime to reach your goal
                  faster
                </p>
                <ShimmerButton
                  className="px-8 py-4 text-lg font-medium mx-auto"
                  onClick={handleTopUp}
                  background="#ffff"
                  shimmerColor="#0a0a0a"
                  shimmerSize="0.05em"
                >
                  <div className="flex items-center space-x-3">
                    <Plus size={20} className="text-black" />
                    <span className="text-black">Top Up Saving</span>
                  </div>
                </ShimmerButton>
              </div>
            </div>
          </motion.div>

          {/* Motivation Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-12"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl opacity-50" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
                <Award size={32} className="text-white/80 mx-auto mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">
                  Keep Going!
                </h3>
                <p className="text-white/70 max-w-2xl mx-auto">
                  You&apos;re {progressPercentage}% of the way to your dream
                  vacation. Every contribution brings you closer to experiencing
                  Japan!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Top Up Modal */}
      <AnimatePresence>
        {showTopUpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-md"
            >
              <button
                onClick={handleCancel}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors duration-300"
              >
                <X size={20} />
              </button>

              <h3 className="text-white text-2xl font-bold mb-6 text-center">
                Add to Savings
              </h3>

              <div className="mb-6">
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Amount to Transfer
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60">
                    $
                  </span>
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    placeholder="100"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300"
                  />
                </div>
                {errors && (
                  <p className="text-red-400 text-sm mt-2">{errors}</p>
                )}
              </div>

              <div className="flex space-x-4">
                <ShimmerButton
                  shimmerSize="0em"
                  onClick={handleCancel}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 text-white/80 hover:bg-white/10 transition-all duration-300"
                >
                  Cancel
                </ShimmerButton>
                <ShimmerButton
                  className="flex-1 py-3"
                  onClick={handleConfirmTopUp}
                  background="#ffff"
                  shimmerColor="#0a0a0a"
                  shimmerSize="0.05em"
                >
                  <span className="text-black">Continue</span>
                </ShimmerButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-md"
            >
              <div className="text-center mb-6">
                <CheckCircle size={48} className="text-white mx-auto mb-4" />
                <h3 className="text-white text-2xl font-bold mb-2">
                  Confirm Transfer
                </h3>
                <p className="text-white/70">
                  Transfer{" "}
                  <span className="text-white font-semibold">
                    ${topUpAmount}
                  </span>{" "}
                  to your savings plan?
                </p>
              </div>

              <div className="flex space-x-4">
                <ShimmerButton
                  shimmerSize="0em"
                  onClick={handleCancel}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 text-white/80 hover:bg-white/10 transition-all duration-300"
                >
                  Cancel
                </ShimmerButton>
                <ShimmerButton
                  className="flex-1 py-3"
                  onClick={handleFinalConfirm}
                  background="#ffff"
                  shimmerColor="#0a0a0a"
                  shimmerSize="0.05em"
                >
                  <span className="text-black">Confirm</span>
                </ShimmerButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
    </div>
  );
}
