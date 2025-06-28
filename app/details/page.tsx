"use client";

import { useState, useEffect, Suspense } from "react";
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
  Minus,
  AlertTriangle,
  Shield,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Particles from "@/components/reactbits/Particles/Particles";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { useAuth } from "@/hooks/useAuth";
import { useICPPrice } from "@/contexts/ICPPriceContext";
import { getUserSavings, topUpSaving, withdrawSaving, stakeICP, unstakeICP, getStakingInfo } from "@/service/icService";

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

function SavingsPlanDetailsContent() {
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

  // New staking-related state
  const [isStaking, setIsStaking] = useState(false);
  const [stakingProgress, setStakingProgress] = useState("");
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [unstakingProgress, setUnstakingProgress] = useState("");

  // Withdraw state management
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showWithdrawConfirmation, setShowWithdrawConfirmation] = useState(false);
  const [withdrawErrors, setWithdrawErrors] = useState("");
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);
  const [isForceWithdraw, setIsForceWithdraw] = useState(false);

  // Constants for withdrawal
  const NORMAL_ADMIN_FEE = 0.02; // 2%
  const PENALTY_ADMIN_FEE = 0.05; // 5% for early withdrawal
  const CURRENT_DATE = new Date();

  // Get saving ID from URL params or use default
  const savingId = searchParams.get("id") || "1";

  // Check if withdrawal is eligible (current month matches target month)
  const isWithdrawalEligible = (targetDate: string) => {
    const target = new Date(targetDate);
    return (
      CURRENT_DATE.getMonth() === target.getMonth() &&
      CURRENT_DATE.getFullYear() === target.getFullYear()
    );
  };

  // Calculate admin fee based on withdrawal type
  const calculateAdminFee = (amount: number, isForce: boolean) => {
    const feeRate = isForce ? PENALTY_ADMIN_FEE : NORMAL_ADMIN_FEE;
    return amount * feeRate;
  };

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

  const handleWithdraw = () => {
    if (!savingPlan) return;

    const eligible = isWithdrawalEligible(savingPlan.targetDate);
    setIsForceWithdraw(!eligible);
    setShowWithdrawModal(true);
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

  const validateWithdrawAmount = () => {
    if (!withdrawAmount.trim()) {
      setWithdrawErrors("Please enter an amount");
      return false;
    }
    if (isNaN(Number(withdrawAmount)) || Number(withdrawAmount) <= 0) {
      setWithdrawErrors("Please enter a valid amount");
      return false;
    }
    if (savingPlan && Number(withdrawAmount) > savingPlan.currentSaved) {
      setWithdrawErrors("Amount exceeds available savings");
      return false;
    }
    setWithdrawErrors("");
    return true;
  };

  const handleConfirmTopUp = () => {
    if (!validateAmount()) return;
    setShowTopUpModal(false);
    setShowConfirmation(true);
  };

  const handleConfirmWithdraw = () => {
    if (!validateWithdrawAmount()) return;
    setShowWithdrawModal(false);
    setShowWithdrawConfirmation(true);
  };

  const handleFinalConfirm = async () => {
    if (!savingPlan) return;

    setIsProcessingTopUp(true);
    setStakingProgress("Initiating transfer...");

    try {
      if (!actor || !isAuthenticated || !principal) return;

      const nominal = BigInt(Math.floor(Number(topUpAmount) * 100000000));

      // Step 1: Transfer funds to savings
      setStakingProgress("Transferring funds to savings...");
      await topUpSaving(actor, {
        amount: nominal,
        savingId: BigInt(savingId),
        principalId: principal
      });

      console.log(`Transferring ${topUpAmount} ICP to saving plan ${savingPlan.id}`);

      // Step 2: If staking is enabled, automatically stake the deposited amount
      if (savingPlan.isStaking) {
        setIsStaking(true);
        setStakingProgress("Staking deposited amount...");

        try {
          const stakingResult = await stakeICP(actor, {
            amount: nominal,
            principalId: principal,
            savingId: BigInt(savingId),
            dissolveDelay: BigInt(365 * 24 * 60 * 60 * 1000000000) // 1 year in nanoseconds
          });

          if ("Ok" in stakingResult) {
            console.log(`Successfully staked ${topUpAmount} ICP`);
            console.log(`Neuron ID: ${stakingResult.Ok.neuronId}`);
            console.log(`Expected rewards: ${Number(stakingResult.Ok.expectedRewards) / 100000000} ICP`);
            console.log(`Dissolve delay: ${Number(stakingResult.Ok.dissolveDelay) / (24 * 60 * 60 * 1000000000)} days`);
            setStakingProgress("Staking completed successfully!");
          } else {
            console.warn("Staking failed:", stakingResult.Err);
            setStakingProgress(`Transfer completed, staking failed: ${stakingResult.Err}`);
          }
        } catch (stakingError) {
          console.error("Failed to stake deposited amount:", stakingError);
          setStakingProgress("Transfer completed, staking failed");
          // Don't throw error here - the transfer was successful
        }
      }

      // Update the saving plan with new amount
      const newCurrentSaved = savingPlan.currentSaved + Number(topUpAmount);
      setSavingPlan({
        ...savingPlan,
        currentSaved: newCurrentSaved,
      });

      setShowConfirmation(false);
      setTopUpAmount("");

      // Show confetti if goal is reached
      if (newCurrentSaved >= savingPlan.totalAmount) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }

    } catch (error) {
      console.error("Failed to process top-up:", error);
      setTopUpErrors("Failed to process top-up. Please try again.");
      setStakingProgress("Transfer failed");
    } finally {
      setIsProcessingTopUp(false);
      setIsStaking(false);
      // Clear staking progress after a delay
      setTimeout(() => setStakingProgress(""), 3000);
    }
  };

  const handleFinalWithdrawConfirm = async () => {
    if (!savingPlan) return;

    setIsProcessingWithdraw(true);
    setUnstakingProgress("Initiating withdrawal...");

    try {
      if (!actor || !isAuthenticated || !principal) return;

      const withdrawalAmount = Number(withdrawAmount);

      // Step 1: If staking is enabled, unstake first
      if (savingPlan.isStaking) {
        setIsUnstaking(true);
        setUnstakingProgress("Checking staking positions...");

        try {
          // Get staking info for this saving plan
          const stakingInfo = await getStakingInfo(actor, BigInt(savingId));

          if (stakingInfo && stakingInfo.neuronId) {
            setUnstakingProgress("Unstaking funds...");

            const unstakeResult = await unstakeICP(actor, {
              savingId: BigInt(savingId),
              neuronId: stakingInfo.neuronId,
              principalId: principal
            });

            if ("Ok" in unstakeResult) {
              console.log(`Successfully unstaked for saving plan ${savingId}`);
              setUnstakingProgress("Unstaking completed, proceeding with withdrawal...");
            } else {
              console.warn("Unstaking failed:", unstakeResult.Err);
              setUnstakingProgress(`Unstaking failed: ${unstakeResult.Err}, proceeding with withdrawal...`);
              // Continue with withdrawal even if unstaking fails
            }
          } else {
            console.log("No staking position found, proceeding with withdrawal");
            setUnstakingProgress("No staking position found, proceeding with withdrawal...");
          }
        } catch (unstakingError) {
          console.error("Failed to unstake:", unstakingError);
          setUnstakingProgress("Unstaking failed, proceeding with withdrawal...");
          // Continue with withdrawal even if unstaking fails
        }
      }

      // Step 2: Proceed with withdrawal
      setUnstakingProgress("Processing withdrawal...");
      await withdrawSaving(actor, BigInt(savingId));

      const adminFee = calculateAdminFee(withdrawalAmount, isForceWithdraw);
      const netAmount = withdrawalAmount - adminFee;

      console.log(
        `Withdrawing ${withdrawAmount} ICP from saving plan ${savingPlan.id}`
      );
      console.log(`Admin fee: ${adminFee.toFixed(8)} ICP`);
      console.log(`Net amount received: ${netAmount.toFixed(8)} ICP`);

      // Update the saving plan with new amount
      const newCurrentSaved = Math.max(0, savingPlan.currentSaved - withdrawalAmount);
      setSavingPlan({
        ...savingPlan,
        currentSaved: newCurrentSaved,
      });

      setShowWithdrawConfirmation(false);
      setWithdrawAmount("");
      setIsForceWithdraw(false);
      setUnstakingProgress("Withdrawal completed successfully!");

    } catch (error) {
      console.error("Failed to process withdrawal:", error);
      setWithdrawErrors("Failed to process withdrawal. Please try again.");
      setUnstakingProgress("Withdrawal failed");
    } finally {
      setIsProcessingWithdraw(false);
      setIsUnstaking(false);
      // Clear unstaking progress after a delay
      setTimeout(() => setUnstakingProgress(""), 3000);
    }
  };

  const handleCancel = () => {
    setShowTopUpModal(false);
    setShowConfirmation(false);
    setTopUpAmount("");
    setTopUpErrors("");
    setStakingProgress("");
    setUnstakingProgress("");
  };

  const handleWithdrawCancel = () => {
    setShowWithdrawModal(false);
    setShowWithdrawConfirmation(false);
    setWithdrawAmount("");
    setWithdrawErrors("");
    setIsForceWithdraw(false);
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
      <div className="relative min-h-screen w-screen overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50">
        {/* Modern Colorful Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-green-400/15 to-emerald-400/15 rounded-full blur-3xl" />

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full"
            />
            <div className="text-gray-800 text-xl font-medium">Loading savings plan...</div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !savingPlan) {
    return (
      <div className="relative min-h-screen w-screen overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50">
        {/* Modern Colorful Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center space-y-4">
            <AlertCircle className="w-16 h-16 text-red-500" />
            <div className="text-gray-800 text-xl font-medium">{error}</div>
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min(
    Math.round((savingPlan.currentSaved / savingPlan.totalAmount) * 100),
    100
  );

  const isEligibleForNormalWithdraw = isWithdrawalEligible(savingPlan.targetDate);

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Modern Colorful Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-green-400/15 to-emerald-400/15 rounded-full blur-3xl" />

      {/* Enhanced Floating Elements */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full animate-pulse ${i % 3 === 0
                ? "bg-purple-300/60"
                : i % 3 === 1
                  ? "bg-blue-300/60"
                  : "bg-pink-300/60"
              }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

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
          <span className="text-sm text-gray-600 font-medium">Savings Plan</span>
          <ChevronRight size={16} className="text-gray-400" />
          <span className="text-sm text-gray-500 font-medium">#{savingPlan.id}</span>
        </div>
      </motion.div>

      {/* Refresh Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="absolute top-8 right-8 z-20"
      >
        <button
          onClick={refreshData}
          disabled={isLoading}
          className="p-3 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg shadow-purple-500/5 text-gray-600 hover:text-purple-600 transition-colors duration-300 disabled:opacity-50"
        >
          <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
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
      <div className="relative z-10 min-h-screen px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex gap-2 bg-white/80 backdrop-blur-sm border border-purple-200/30 rounded-full px-4 py-2 mb-6 shadow-sm items-center">
              <Target className="w-4 h-4 text-purple-500" />
              <span className="text-lg text-gray-700 font-medium">
                Savings Plan Details
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              <span className="text-6xl mr-4">{savingPlan.icon}</span>
              {savingPlan.target}
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Track your progress and manage your savings goal
            </p>

            <div className="mt-4 flex items-center justify-center space-x-4">
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${savingPlan.status === 'Active'
                  ? 'bg-green-100 text-green-700'
                  : savingPlan.status === 'Completed'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                {savingPlan.status}
              </div>

              {savingPlan.isStaking && (
                <div className="bg-purple-100 text-purple-700 text-sm px-4 py-2 rounded-full">
                  Auto-Staking Active
                </div>
              )}

              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${isEligibleForNormalWithdraw
                  ? 'bg-green-100 text-green-700'
                  : 'bg-orange-100 text-orange-700'
                }`}>
                {isEligibleForNormalWithdraw ? "Withdrawal Available" : "Early Withdrawal Only"}
              </div>
            </div>

            {/* ICP Rate Display */}
            <div className="mt-4 flex items-center justify-center space-x-2">
              {priceData.error ? (
                <div className="flex items-center space-x-2 text-red-500">
                  <AlertCircle size={14} />
                  <span className="text-sm">Price unavailable</span>
                </div>
              ) : (
                <>
                  <span className="text-gray-600 text-sm">
                    1 ICP = ${priceData.price.toFixed(2)} USD
                  </span>
                  <div
                    className={`flex items-center space-x-1 text-xs ${priceData.changePercent24h >= 0
                      ? "text-green-600"
                      : "text-red-600"
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
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </>
              )}
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Progress and Overview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Progress Card */}
              <div className="bg-white/80 backdrop-blur-xl border border-gray-200/30 rounded-3xl p-8 shadow-lg shadow-purple-500/5">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <TrendingUp className="w-6 h-6 text-purple-600 mr-3" />
                    Progress Overview
                  </h2>
                  <div className={`px-4 py-2 rounded-full text-sm font-semibold ${savingPlan.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : savingPlan.status === 'Completed'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                    {savingPlan.status}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{progressPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200/50 rounded-full h-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Current Saved</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatICP(savingPlan.currentSaved)} ICP
                        </p>
                        <p className="text-sm text-gray-500">
                          ≈ ${formatUSD(savingPlan.currentSaved)}
                        </p>
                      </div>
                      <DollarSign className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Target Amount</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatICP(savingPlan.totalAmount)} ICP
                        </p>
                        <p className="text-sm text-gray-500">
                          ≈ ${formatUSD(savingPlan.totalAmount)}
                        </p>
                      </div>
                      <Target className="w-8 h-8 text-green-600" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Monthly Target</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatICP(savingPlan.monthlyTarget)} ICP
                        </p>
                        <p className="text-sm text-gray-500">
                          ≈ ${formatUSD(savingPlan.monthlyTarget)}
                        </p>
                      </div>
                      <Calendar className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Time Remaining</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {savingPlan.timelineMonths} months
                        </p>
                        <p className="text-sm text-gray-500">
                          Target: {savingPlan.targetDate}
                        </p>
                      </div>
                      <Calendar className="w-8 h-8 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Milestone */}
              <div className="bg-white/80 backdrop-blur-xl border border-gray-200/30 rounded-3xl p-6 shadow-lg shadow-purple-500/5">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Award className="w-5 h-5 text-yellow-600 mr-2" />
                  Next Milestone
                </h3>
                <p className="text-lg text-gray-700">{savingPlan.nextMilestone}</p>
              </div>

              {/* Staking Status */}
              {savingPlan.isStaking && (
                <div className="bg-white/80 backdrop-blur-xl border border-gray-200/30 rounded-3xl p-6 shadow-lg shadow-purple-500/5">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Shield className="w-5 h-5 text-green-600 mr-2" />
                    Staking Active
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-lg text-gray-700">Your ICP is earning staking rewards</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right Column - Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Quick Actions */}
              <div className="bg-white/80 backdrop-blur-xl border border-gray-200/30 rounded-3xl p-6 shadow-lg shadow-purple-500/5">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>

                <div className="space-y-4">
                  <ShimmerButton
                    onClick={handleTopUp}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Top Up Savings
                  </ShimmerButton>

                  <button
                    onClick={handleWithdraw}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center"
                  >
                    <Minus className="w-5 h-5 mr-2" />
                    Withdraw Funds
                  </button>

                  {!savingPlan.isStaking && (
                    <button
                      onClick={() => alert("Staking functionality coming soon!")}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center"
                    >
                      <Shield className="w-5 h-5 mr-2" />
                      Start Staking
                    </button>
                  )}
                </div>
              </div>

              {/* Plan Details */}
              <div className="bg-white/80 backdrop-blur-xl border border-gray-200/30 rounded-3xl p-6 shadow-lg shadow-purple-500/5">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Plan Details</h3>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan ID</span>
                    <span className="font-semibold">#{savingPlan.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date</span>
                    <span className="font-semibold">{savingPlan.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority Level</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${savingPlan.priorityLevel === 1
                        ? 'bg-red-100 text-red-700'
                        : savingPlan.priorityLevel === 2
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                      {savingPlan.priorityLevel === 1 ? 'High' : savingPlan.priorityLevel === 2 ? 'Medium' : 'Low'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Staking</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${savingPlan.isStaking ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                      {savingPlan.isStaking ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Withdrawal Eligibility */}
              <div className={`backdrop-blur-xl border rounded-3xl p-6 shadow-lg ${isEligibleForNormalWithdraw
                  ? 'bg-green-50/80 border-green-200/30'
                  : 'bg-orange-50/80 border-orange-200/30'
                }`}>
                <div className="flex items-center mb-3">
                  {isEligibleForNormalWithdraw ? (
                    <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-orange-600 mr-2" />
                  )}
                  <h3 className="text-lg font-bold text-gray-900">
                    Withdrawal Status
                  </h3>
                </div>
                <p className={`text-sm ${isEligibleForNormalWithdraw ? 'text-green-700' : 'text-orange-700'
                  }`}>
                  {isEligibleForNormalWithdraw
                    ? 'You can withdraw with standard 2% fee'
                    : 'Early withdrawal incurs 5% penalty fee'
                  }
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Modals remain the same - Top Up Modal */}
      <AnimatePresence>
        {showTopUpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Top Up Savings</h3>
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (ICP)
                  </label>
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter amount in ICP"
                    step="0.0001"
                    min="0"
                  />
                  {topUpErrors && (
                    <p className="text-red-500 text-sm mt-1">{topUpErrors}</p>
                  )}
                </div>

                {topUpAmount && !isNaN(Number(topUpAmount)) && Number(topUpAmount) > 0 && (
                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600">
                      Equivalent: ≈ ${formatUSD(Number(topUpAmount))}
                    </p>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <ShimmerButton
                    onClick={handleConfirmTopUp}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  >
                    Continue
                  </ShimmerButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {isForceWithdraw ? "Force Withdraw" : "Withdraw Funds"}
                </h3>
                <button
                  onClick={handleWithdrawCancel}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Warning for force withdrawal */}
              {isForceWithdraw && (
                <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-orange-800 font-medium text-sm mb-1">Early Withdrawal Penalty</h4>
                      <p className="text-orange-700 text-xs">
                        Withdrawing before {savingPlan?.targetDate} incurs a 5% admin fee instead of the normal 2% fee.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount to Withdraw (ICP)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    max={savingPlan?.currentSaved}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder={`Max: ${formatICP(savingPlan?.currentSaved || 0)}`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {withdrawErrors && (
                    <p className="text-red-500 text-sm mt-1">{withdrawErrors}</p>
                  )}
                </div>

                {/* Amount calculations */}
                {withdrawAmount && Number(withdrawAmount) > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Withdrawal Amount:</span>
                      <span className="text-gray-900">{withdrawAmount} ICP</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Admin Fee ({isForceWithdraw ? '5%' : '2%'}):</span>
                      <span className="text-red-600">-{formatICP(calculateAdminFee(Number(withdrawAmount), isForceWithdraw))} ICP</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between font-medium">
                        <span className="text-gray-900">You&apos;ll Receive:</span>
                        <span className="text-green-600">{formatICP(Number(withdrawAmount) - calculateAdminFee(Number(withdrawAmount), isForceWithdraw))} ICP</span>
                      </div>
                      <div className="flex justify-between text-gray-500 text-xs">
                        <span>≈ USD:</span>
                        <span>${formatUSD(Number(withdrawAmount) - calculateAdminFee(Number(withdrawAmount), isForceWithdraw))}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick amount buttons */}
                <div>
                  <p className="text-gray-600 text-sm mb-3">Quick amounts:</p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setWithdrawAmount((savingPlan?.currentSaved * 0.25 || 0).toFixed(8))}
                      className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg py-2 text-gray-700 text-sm transition-all duration-300"
                    >
                      25%
                    </button>
                    <button
                      onClick={() => setWithdrawAmount((savingPlan?.currentSaved * 0.5 || 0).toFixed(8))}
                      className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg py-2 text-gray-700 text-sm transition-all duration-300"
                    >
                      50%
                    </button>
                    <button
                      onClick={() => setWithdrawAmount((savingPlan?.currentSaved || 0).toFixed(8))}
                      className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg py-2 text-gray-700 text-sm transition-all duration-300"
                    >
                      Max
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleWithdrawCancel}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <ShimmerButton
                    onClick={handleConfirmWithdraw}
                    className={`flex-1 ${isForceWithdraw ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'} text-white`}
                  >
                    {isForceWithdraw ? "Force Withdraw" : "Withdraw"}
                  </ShimmerButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top-Up Confirmation Modal with Staking Progress */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="text-center mb-6">
                {isProcessingTopUp ? (
                  <div className="mb-4">
                    <Loader
                      size={48}
                      className="text-purple-600 mx-auto mb-4 animate-spin"
                    />
                    {isStaking && (
                      <Shield size={24} className="text-green-500 mx-auto mb-2" />
                    )}
                  </div>
                ) : (
                  <CheckCircle size={48} className="text-purple-600 mx-auto mb-4" />
                )}

                <h3 className="text-gray-900 text-2xl font-bold mb-2">
                  {isProcessingTopUp
                    ? (isStaking ? "Processing & Staking..." : "Processing Transfer...")
                    : (savingPlan.isStaking ? "Confirm Transfer & Staking" : "Confirm Transfer")}
                </h3>

                <div className="text-gray-600">
                  {isProcessingTopUp ? (
                    <div className="space-y-2">
                      <p>{stakingProgress}</p>
                      {isStaking && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-700 text-sm">
                            🔄 Auto-staking in progress...
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p>
                        Transfer{" "}
                        <span className="text-gray-900 font-semibold">
                          {topUpAmount} ICP
                        </span>{" "}
                        to your savings plan
                      </p>
                      <p className="text-gray-500 text-sm">
                        ≈ ${formatUSD(Number(topUpAmount))} USD
                      </p>

                      {savingPlan.isStaking && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-center space-x-2">
                            <Shield size={16} className="text-green-600" />
                            <span className="text-green-700 text-sm">
                              Funds will be automatically staked after transfer
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {!isProcessingTopUp && (
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <ShimmerButton
                    onClick={handleFinalConfirm}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  >
                    {savingPlan.isStaking ? "Transfer & Stake" : "Confirm"}
                  </ShimmerButton>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Withdraw Confirmation Modal */}
      <AnimatePresence>
        {showWithdrawConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="text-center mb-6">
                {isProcessingWithdraw ? (
                  <div className="mb-4">
                    <Loader
                      size={48}
                      className="text-purple-600 mx-auto mb-4 animate-spin"
                    />
                    {isUnstaking && (
                      <Shield size={24} className="text-orange-500 mx-auto mb-2" />
                    )}
                  </div>
                ) : (
                  <div className="mb-4">
                    {isForceWithdraw ? (
                      <AlertTriangle size={48} className="text-orange-500 mx-auto" />
                    ) : (
                      <CheckCircle size={48} className="text-blue-500 mx-auto" />
                    )}
                  </div>
                )}
                <h3 className="text-gray-900 text-2xl font-bold mb-2">
                  {isProcessingWithdraw
                    ? (isUnstaking ? "Processing Unstaking & Withdrawal..." : "Processing Withdrawal...")
                    : "Confirm Withdrawal"}
                </h3>

                {isProcessingWithdraw && (
                  <div className="space-y-2">
                    <p className="text-gray-600">{unstakingProgress}</p>
                    {isUnstaking && savingPlan.isStaking && (
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-orange-700 text-sm">
                          🔄 Auto-unstaking in progress...
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {!isProcessingWithdraw && (
                  <div className="space-y-3">
                    {/* Unstaking warning for staked savings */}
                    {savingPlan.isStaking && (
                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                        <div className="flex items-start space-x-3">
                          <Shield size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-orange-800 font-medium text-sm mb-1">Auto-Unstaking Required</h4>
                            <p className="text-orange-700 text-xs">
                              Your staked funds will be automatically unstaked before withdrawal. This may take some time to process.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-gray-50 rounded-xl text-left space-y-2">
                      <div className="flex justify-between text-gray-600 text-sm">
                        <span>Withdrawal Amount:</span>
                        <span className="text-gray-900">{withdrawAmount} ICP</span>
                      </div>
                      <div className="flex justify-between text-gray-600 text-sm">
                        <span>Admin Fee ({isForceWithdraw ? '5%' : '2%'}):</span>
                        <span className="text-red-600">-{formatICP(calculateAdminFee(Number(withdrawAmount), isForceWithdraw))} ICP</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2">
                        <div className="flex justify-between font-medium">
                          <span className="text-gray-900">You&apos;ll Receive:</span>
                          <span className="text-green-600">
                            {formatICP(Number(withdrawAmount) - calculateAdminFee(Number(withdrawAmount), isForceWithdraw))} ICP
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-500 text-xs">
                          <span>≈ USD:</span>
                          <span>${formatUSD(Number(withdrawAmount) - calculateAdminFee(Number(withdrawAmount), isForceWithdraw))}</span>
                        </div>
                      </div>
                    </div>

                    {isForceWithdraw && (
                      <p className="text-orange-400 text-sm">
                        ⚠️ Early withdrawal penalty applied due to withdrawal before target date
                      </p>
                    )}
                  </div>
                )}
              </div>

              {!isProcessingWithdraw && (
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleWithdrawCancel}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <ShimmerButton
                    onClick={handleFinalWithdrawConfirm}
                    className={`flex-1 ${isForceWithdraw ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'} text-white`}
                  >
                    {isForceWithdraw ? "Confirm Force Withdrawal" : "Confirm Withdrawal"}
                  </ShimmerButton>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Colorful Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-100/40 via-blue-50/20 to-transparent" />
    </div>
  );
}

// Export with Suspense boundary
export default function SavingsPlanDetails() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      }
    >
      <SavingsPlanDetailsContent />
    </Suspense>
  );
}

// Force dynamic rendering to handle searchParams
export const dynamic = 'force-dynamic';