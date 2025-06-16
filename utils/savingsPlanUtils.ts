import { Saving } from "@/service/backend.did";
import { SavingPlanDetails, SavingPlanConstants } from "@/types/savingsPlan";

// Constants for withdrawal
export const SAVINGS_CONSTANTS: SavingPlanConstants = {
  NORMAL_ADMIN_FEE: 0.02, // 2%
  PENALTY_ADMIN_FEE: 0.05, // 5% for early withdrawal
};

// Icon mapping for different saving types
export const getSavingIcon = (savingName: string): string => {
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

// Check if withdrawal is eligible (current month matches target month)
export const isWithdrawalEligible = (targetDate: string): boolean => {
  const target = new Date(targetDate);
  const currentDate = new Date();
  return (
    currentDate.getMonth() === target.getMonth() &&
    currentDate.getFullYear() === target.getFullYear()
  );
};

// Calculate admin fee based on withdrawal type
export const calculateAdminFee = (amount: number, isForce: boolean): number => {
  const feeRate = isForce
    ? SAVINGS_CONSTANTS.PENALTY_ADMIN_FEE
    : SAVINGS_CONSTANTS.NORMAL_ADMIN_FEE;
  return amount * feeRate;
};

// Transform backend data to frontend format
export const transformSavingData = (
  targetSaving: Saving,
  formatICP: (amount: number) => string
): SavingPlanDetails => {
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

  return {
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
};

// Validation functions
export const validateTopUpAmount = (amount: string): string => {
  if (!amount.trim()) {
    return "Please enter an amount";
  }
  if (isNaN(Number(amount)) || Number(amount) <= 0) {
    return "Please enter a valid amount";
  }
  if (Number(amount) > 1000) {
    return "Maximum transfer amount is 1000 ICP";
  }
  return "";
};

export const validateWithdrawAmount = (
  amount: string,
  maxAmount: number
): string => {
  if (!amount.trim()) {
    return "Please enter an amount";
  }
  if (isNaN(Number(amount)) || Number(amount) <= 0) {
    return "Please enter a valid amount";
  }
  if (Number(amount) > maxAmount) {
    return "Amount exceeds available savings";
  }
  return "";
};

// Calculate progress percentage
export const calculateProgress = (current: number, total: number): number => {
  return Math.min(Math.round((current / total) * 100), 100);
};
