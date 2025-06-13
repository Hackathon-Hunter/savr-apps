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
  AlertCircle,
  RefreshCw,
  Loader,
  TrendingDown,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Particles from "@/components/reactbits/Particles/Particles";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { useAuth } from "@/hooks/useAuth";
import { useICPPrice } from "@/contexts/ICPPriceContext";
import { getUserSavings } from "@/service/icService";

// Icon mapping for different saving types
const getSavingIcon = (savingName: string) => {
  const name = savingName.toLowerCase();
  if (
    name.includes("vacation") ||
    name.includes("travel") ||
    name.includes("trip")
  )
    return "✈️";
  if (name.includes("car") || name.includes("vehicle")) return "🚗";
  if (
    name.includes("emergency") ||
    name.includes("home") ||
    name.includes("house")
  )
    return "🏠";
  if (
    name.includes("education") ||
    name.includes("school") ||
    name.includes("study")
  )
    return "🎓";
  return "🎯"; // Default icon
};

interface SavingPlanDetails {
  id: number;
  target: string;
  totalAmount: number;
  currentSaved: number;
  monthlyTarget: number;
  timelineMonths: number;
  nextMilestone: string;
  startDate: string;
  targetDate: string;
  isStaking: boolean;
  status: string;
  priorityLevel: number;
  savingsRate: number;
  icon: string;
}

export default function SavingsPlanDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { actor, isAuthenticated, principal } = useAuth();
  const { priceData, formatUSD, formatICP } = useICPPrice();

  // State management
  const [savingPlan, setSavingPlan] = useState<SavingPlanDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [topUpErrors, setTopUpErrors] = useState("");
  const [isProcessingTopUp, setIsProcessingTopUp] = useState(false);

  // Get saving ID from URL params or use default
  const savingId = searchParams.get("id") || "1";

  // Fetch saving plan details
  useEffect(() => {
    const fetchSavingDetails = async () => {
      if (!actor || !isAuthenticated || !principal) return;

      setIsLoading(true);
      setError("");

      try {
        // Fetch user savings
        const userSavingsData = await getUserSavings(actor, principal);

        // Find the specific saving plan
        const targetSaving = userSavingsData.find(
          (saving) => Number(saving.id) === Number(savingId)
        );

        if (!targetSaving) {
          setError("Saving plan not found");
          return;
        }

        // Convert backend data to frontend format
        const targetAmount = Number(targetSaving.totalSaving) / 100000000;
        const currentAmount = Number(targetSaving.currentAmount) / 100000000;
        const monthlyTarget = Number(targetSaving.amount) / 100000000;

        // Calculate timeline
        const deadlineDate = new Date(Number(targetSaving.deadline) / 1000000);
        const createdDate = new Date(Number(targetSaving.createdAt) / 1000000);
        const totalMonths = Math.ceil(
          (deadlineDate.getTime() - createdDate.getTime()) /
            (1000 * 60 * 60 * 24 * 30)
        );
        const elapsedMonths = Math.ceil(
          (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
        );
        const remainingMonths = Math.max(0, totalMonths - elapsedMonths);

        // Calculate next milestone (25% increments)
        const progressPercent =
          targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;
        let nextMilestonePercent = 25;
        if (progressPercent >= 75) nextMilestonePercent = 100;
        else if (progressPercent >= 50) nextMilestonePercent = 75;
        else if (progressPercent >= 25) nextMilestonePercent = 50;

        const nextMilestoneAmount = (targetAmount * nextMilestonePercent) / 100;

        // Map status
        let status = "Active";
        if ("Completed" in targetSaving.status) status = "Completed";
        if ("Cancelled" in targetSaving.status) status = "Cancelled";

        const planDetails: SavingPlanDetails = {
          id: Number(targetSaving.id),
          target: targetSaving.savingName,
          totalAmount: targetAmount,
          currentSaved: currentAmount,
          monthlyTarget: monthlyTarget,
          timelineMonths: remainingMonths,
          nextMilestone: `${nextMilestonePercent}% milestone (${formatICP(
            nextMilestoneAmount
          )} ICP)`,
          startDate: createdDate.toLocaleDateString(),
          targetDate: deadlineDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
          isStaking: targetSaving.isStaking,
          status: status,
          priorityLevel: Number(targetSaving.priorityLevel),
          savingsRate: Number(targetSaving.savingsRate),
          icon: getSavingIcon(targetSaving.savingName),
        };

        setSavingPlan(planDetails);

        // Show confetti for recently completed plans
        if (status === "Completed" && progressPercent >= 95) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }
      } catch (error) {
        console.error("Failed to fetch saving details:", error);
        setError("Failed to load saving plan details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavingDetails();
  }, [actor, isAuthenticated, principal, savingId, formatICP]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/connect-wallet");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleBack = () => {
    router.push("/dashboard");
  };

  const handleTopUp = () => {
    setShowTopUpModal(true);
  };

  const validateAmount = () => {
    if (!topUpAmount.trim()) {
      setTopUpErrors("Please enter an amount");
      return false;
    }
    if (isNaN(Number(topUpAmount)) || Number(topUpAmount) <= 0) {
      setTopUpErrors("Please enter a valid amount");
      return false;
    }
    if (Number(topUpAmount) > 1000) {
      setTopUpErrors("Maximum transfer amount is 1000 ICP");
      return false;
    }
    setTopUpErrors("");
    return true;
  };

  const handleConfirmTopUp = () => {
    if (!validateAmount()) return;
    setShowTopUpModal(false);
    setShowConfirmation(true);
  };

  const handleFinalConfirm = async () => {
    if (!savingPlan) return;

    setIsProcessingTopUp(true);
    try {
      // Here you would implement the actual top-up logic
      // For now, we'll simulate it
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log(
        `Transferring ${topUpAmount} ICP to saving plan ${savingPlan.id}`
      );

      // Update the saving plan with new amount
      const newCurrentSaved = savingPlan.currentSaved + Number(topUpAmount);
      setSavingPlan({
        ...savingPlan,
        currentSaved: newCurrentSaved,
      });

      setShowConfirmation(false);
      setTopUpAmount("");

      // Show success message or confetti if goal is reached
      if (newCurrentSaved >= savingPlan.totalAmount) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } catch (error) {
      console.error("Failed to process top-up:", error);
      setTopUpErrors("Failed to process top-up. Please try again.");
    } finally {
      setIsProcessingTopUp(false);
    }
  };

  const handleCancel = () => {
    setShowTopUpModal(false);
    setShowConfirmation(false);
    setTopUpAmount("");
    setTopUpErrors("");
  };

  const refreshData = async () => {
    if (!actor || !isAuthenticated || !principal) return;

    setIsLoading(true);
    try {
      const userSavingsData = await getUserSavings(actor, principal);
      const targetSaving = userSavingsData.find(
        (saving) => Number(saving.id) === Number(savingId)
      );

      if (targetSaving) {
        const targetAmount = Number(targetSaving.totalSaving) / 100000000;
        const currentAmount = Number(targetSaving.currentAmount) / 100000000;

        setSavingPlan((prev) =>
          prev
            ? {
                ...prev,
                currentSaved: currentAmount,
                totalAmount: targetAmount,
              }
            : null
        );
      }
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="relative min-h-screen w-screen overflow-hidden bg-black flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <div className="text-center">
          <Loader size={32} className="text-white animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading saving plan details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !savingPlan) {
    return (
      <div className="relative min-h-screen w-screen overflow-hidden bg-black flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-white text-xl font-semibold mb-2">
            Failed to Load Saving Plan
          </h2>
          <p className="text-white/60 mb-6">
            {error || "Saving plan not found"}
          </p>
          <div className="flex gap-4 justify-center">
            <ShimmerButton
              className="px-6 py-3"
              onClick={handleBack}
              background="#1f2937"
              shimmerColor="#ffffff"
              shimmerSize="0.05em"
            >
              <span className="text-white">Back to Dashboard</span>
            </ShimmerButton>
            <ShimmerButton
              className="px-6 py-3"
              onClick={() => window.location.reload()}
              background="#ffffff"
              shimmerColor="#000000"
              shimmerSize="0.05em"
            >
              <span className="text-black">Retry</span>
            </ShimmerButton>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min(
    Math.round((savingPlan.currentSaved / savingPlan.totalAmount) * 100),
    100
  );

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-black">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />

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

      {/* Refresh Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute top-8 right-8 z-20"
      >
        <button
          onClick={refreshData}
          disabled={isLoading}
          className="flex items-center space-x-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-3 hover:border-white/20 hover:bg-black/20 transition-all duration-300 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={`text-white ${isLoading ? "animate-spin" : ""}`}
          />
          <span className="text-white text-sm">Refresh</span>
        </button>
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
              <span className="text-4xl">{savingPlan.icon}</span>
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              {savingPlan.target}
            </h1>
            <p className="text-white/60 text-lg font-light tracking-wide max-w-2xl mx-auto">
              Track your progress and manage your savings
            </p>

            {/* Status Badge */}
            <div className="mt-4 flex items-center justify-center space-x-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  savingPlan.status === "Active"
                    ? "bg-blue-500/20 border border-blue-500/30 text-blue-400"
                    : savingPlan.status === "Completed"
                    ? "bg-green-500/20 border border-green-500/30 text-green-400"
                    : "bg-red-500/20 border border-red-500/30 text-red-400"
                }`}
              >
                {savingPlan.status}
              </span>

              {savingPlan.isStaking && (
                <span className="bg-green-500/20 border border-green-500/30 text-green-400 text-sm px-3 py-1 rounded-full">
                  Staking Active
                </span>
              )}
            </div>

            {/* ICP Rate Display */}
            <div className="mt-4 flex items-center justify-center space-x-2">
              {priceData.error ? (
                <div className="flex items-center space-x-2 text-red-400">
                  <AlertCircle size={14} />
                  <span className="text-sm">Price unavailable</span>
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
                      {savingPlan.target}
                    </p>
                  </div>
                  <div>
                    <DollarSign
                      size={24}
                      className="text-white/60 mx-auto mb-2"
                    />
                    <p className="text-white/60 text-sm mb-1">Goal Amount</p>
                    <p className="text-white text-xl font-semibold">
                      {formatICP(savingPlan.totalAmount)} ICP
                    </p>
                    <p className="text-white/50 text-sm">
                      ≈ ${formatUSD(savingPlan.totalAmount)} USD
                    </p>
                  </div>
                  <div>
                    <Calendar
                      size={24}
                      className="text-white/60 mx-auto mb-2"
                    />
                    <p className="text-white/60 text-sm mb-1">Target Date</p>
                    <p className="text-white text-xl font-semibold">
                      {savingPlan.targetDate}
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
                      {formatICP(savingPlan.monthlyTarget)} ICP
                    </p>
                    <p className="text-white/50 text-sm">
                      ≈ ${formatUSD(savingPlan.monthlyTarget)} USD
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
                      {formatICP(savingPlan.currentSaved)} ICP
                    </span>
                    <span className="text-white font-medium">
                      {progressPercentage}%
                    </span>
                    <span className="text-white/60 text-sm">
                      {formatICP(savingPlan.totalAmount)} ICP
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
                      {formatICP(savingPlan.currentSaved)} ICP
                    </p>
                    <p className="text-white/50 text-xs mt-1">
                      ≈ ${formatUSD(savingPlan.currentSaved)} USD
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-white/60 text-xs mb-1">Remaining</p>
                    <p className="text-white text-2xl font-bold">
                      {formatICP(
                        Math.max(
                          0,
                          savingPlan.totalAmount - savingPlan.currentSaved
                        )
                      )}{" "}
                      ICP
                    </p>
                    <p className="text-white/50 text-xs mt-1">
                      ≈ $
                      {formatUSD(
                        Math.max(
                          0,
                          savingPlan.totalAmount - savingPlan.currentSaved
                        )
                      )}{" "}
                      USD
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-white/60 text-xs mb-1">Next Milestone</p>
                    <p className="text-white text-lg font-medium">
                      {savingPlan.nextMilestone}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-white/60 text-xs mb-1">Time Remaining</p>
                    <p className="text-white text-lg font-medium">
                      {savingPlan.timelineMonths} months
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Top Up Section - Only show for active plans */}
          {savingPlan.status === "Active" && (
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
                    background="#1f2937"
                    shimmerColor="#ffffff"
                    shimmerSize="0.15em"
                  >
                    <div className="flex items-center space-x-3">
                      <Plus size={20} className="text-white" />
                      <span className="text-white">Add Money</span>
                    </div>
                  </ShimmerButton>
                </div>
              </div>
            </motion.div>
          )}

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
                  {progressPercentage >= 100
                    ? "Congratulations!"
                    : "Keep Going!"}
                </h3>
                <p className="text-white/70 max-w-2xl mx-auto">
                  {progressPercentage >= 100
                    ? `You've successfully reached your ${savingPlan.target} goal! 🎉`
                    : `You're ${progressPercentage}% of the way to your ${savingPlan.target}. Every contribution brings you closer to your dream!`}
                </p>
                {savingPlan.isStaking && (
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center justify-center space-x-2">
                      <TrendingUp size={16} className="text-green-400" />
                      <span className="text-green-400 text-sm font-medium">
                        Your savings are earning ICP staking rewards (8.5% APY)
                      </span>
                    </div>
                  </div>
                )}
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
                  Amount to Transfer (ICP)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    placeholder="8.04"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300"
                  />
                </div>
                {topUpAmount && (
                  <p className="text-white/40 text-sm mt-2">
                    ≈ ${formatUSD(Number(topUpAmount))} USD
                  </p>
                )}
                {topUpErrors && (
                  <p className="text-red-400 text-sm mt-2">{topUpErrors}</p>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 text-white/80 hover:bg-white/10 transition-all duration-300"
                >
                  Cancel
                </button>
                <ShimmerButton
                  className="flex-1 py-3"
                  onClick={handleConfirmTopUp}
                  background="rgba(255, 255, 255, 0.1)"
                  shimmerColor="#ffffff"
                  shimmerSize="0.1em"
                >
                  <span className="text-white">Continue</span>
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
                {isProcessingTopUp ? (
                  <Loader
                    size={48}
                    className="text-white mx-auto mb-4 animate-spin"
                  />
                ) : (
                  <CheckCircle size={48} className="text-white mx-auto mb-4" />
                )}
                <h3 className="text-white text-2xl font-bold mb-2">
                  {isProcessingTopUp ? "Processing..." : "Confirm Transfer"}
                </h3>
                <p className="text-white/70">
                  {isProcessingTopUp ? (
                    "Processing your transfer..."
                  ) : (
                    <>
                      Transfer{" "}
                      <span className="text-white font-semibold">
                        {topUpAmount} ICP
                      </span>{" "}
                      to your savings plan?
                      <br />
                      <span className="text-white/50 text-sm">
                        ≈ ${formatUSD(Number(topUpAmount))} USD
                      </span>
                    </>
                  )}
                </p>
              </div>

              {!isProcessingTopUp && (
                <div className="flex space-x-4">
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 text-white/80 hover:bg-white/10 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <ShimmerButton
                    className="flex-1 py-3"
                    onClick={handleFinalConfirm}
                    background="rgba(255, 255, 255, 0.1)"
                    shimmerColor="#ffffff"
                    shimmerSize="0.1em"
                  >
                    <span className="text-white">Confirm</span>
                  </ShimmerButton>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
    </div>
  );
}
