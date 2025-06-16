import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SavingPlanDetails } from "@/types/savingsPlan";
import {
  transformSavingData,
  validateTopUpAmount,
  validateWithdrawAmount,
  isWithdrawalEligible,
  calculateAdminFee,
} from "@/utils/savingsPlanUtils";
import { getUserSavings } from "@/service/icService";
import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE, Saving } from "@/service/backend.did";

interface UseSavingsPlanProps {
  actor: ActorSubclass<_SERVICE>;
  isAuthenticated: boolean;
  principal: string;
  savingId: string;
  formatICP: (amount: number) => string;
}

export const useSavingsPlan = ({
  actor,
  isAuthenticated,
  principal,
  savingId,
  formatICP,
}: UseSavingsPlanProps) => {
  const router = useRouter();

  // Main state
  const [savingPlan, setSavingPlan] = useState<SavingPlanDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showConfetti, setShowConfetti] = useState(false);

  // Top-up state
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [showTopUpConfirmation, setShowTopUpConfirmation] = useState(false);
  const [topUpErrors, setTopUpErrors] = useState("");
  const [isProcessingTopUp, setIsProcessingTopUp] = useState(false);

  // Withdraw state
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showWithdrawConfirmation, setShowWithdrawConfirmation] =
    useState(false);
  const [withdrawErrors, setWithdrawErrors] = useState("");
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);
  const [isForceWithdraw, setIsForceWithdraw] = useState(false);

  // Fetch saving plan details
  const fetchSavingDetails = useCallback(async () => {
    if (!actor || !isAuthenticated || !principal) return;

    setIsLoading(true);
    setError("");

    try {
      const userSavingsData = await getUserSavings(actor, principal);
      const targetSaving = userSavingsData.find(
        (saving: Saving) => Number(saving.id) === Number(savingId)
      );

      if (!targetSaving) {
        setError("Saving plan not found");
        return;
      }

      const planDetails = transformSavingData(targetSaving, formatICP);
      setSavingPlan(planDetails);

      // Show confetti for recently completed plans
      const progressPercent =
        planDetails.totalAmount > 0
          ? (planDetails.currentSaved / planDetails.totalAmount) * 100
          : 0;

      if (planDetails.status === "Completed" && progressPercent >= 95) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } catch (error) {
      console.error("Failed to fetch saving details:", error);
      setError("Failed to load saving plan details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [actor, isAuthenticated, principal, savingId, formatICP]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/connect-wallet");
    }
  }, [isAuthenticated, isLoading, router]);

  // Initial data fetch
  useEffect(() => {
    fetchSavingDetails();
  }, [fetchSavingDetails]);

  // Navigation handlers
  const handleBack = () => {
    router.push("/dashboard");
  };

  // Top-up handlers
  const handleTopUp = () => {
    setShowTopUpModal(true);
  };

  const handleConfirmTopUp = () => {
    const error = validateTopUpAmount(topUpAmount);
    if (error) {
      setTopUpErrors(error);
      return;
    }
    setTopUpErrors("");
    setShowTopUpModal(false);
    setShowTopUpConfirmation(true);
  };

  const handleFinalTopUpConfirm = async () => {
    if (!savingPlan) return;

    setIsProcessingTopUp(true);
    try {
      // Simulate API call
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

      setShowTopUpConfirmation(false);
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

  // Withdraw handlers
  const handleWithdraw = () => {
    if (!savingPlan) return;

    const eligible = isWithdrawalEligible(savingPlan.targetDate);
    setIsForceWithdraw(!eligible);
    setShowWithdrawModal(true);
  };

  const handleConfirmWithdraw = () => {
    if (!savingPlan) return;

    const error = validateWithdrawAmount(
      withdrawAmount,
      savingPlan.currentSaved
    );
    if (error) {
      setWithdrawErrors(error);
      return;
    }
    setWithdrawErrors("");
    setShowWithdrawModal(false);
    setShowWithdrawConfirmation(true);
  };

  const handleFinalWithdrawConfirm = async () => {
    if (!savingPlan) return;

    setIsProcessingWithdraw(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const withdrawalAmount = Number(withdrawAmount);
      const adminFee = calculateAdminFee(withdrawalAmount, isForceWithdraw);
      const netAmount = withdrawalAmount - adminFee;

      console.log(
        `Withdrawing ${withdrawAmount} ICP from saving plan ${savingPlan.id}`
      );
      console.log(`Admin fee: ${adminFee.toFixed(8)} ICP`);
      console.log(`Net amount received: ${netAmount.toFixed(8)} ICP`);

      // Update the saving plan with new amount
      const newCurrentSaved = Math.max(
        0,
        savingPlan.currentSaved - withdrawalAmount
      );
      setSavingPlan({
        ...savingPlan,
        currentSaved: newCurrentSaved,
      });

      setShowWithdrawConfirmation(false);
      setWithdrawAmount("");
      setIsForceWithdraw(false);
    } catch (error) {
      console.error("Failed to process withdrawal:", error);
      setWithdrawErrors("Failed to process withdrawal. Please try again.");
    } finally {
      setIsProcessingWithdraw(false);
    }
  };

  // Cancel handlers
  const handleTopUpCancel = () => {
    setShowTopUpModal(false);
    setShowTopUpConfirmation(false);
    setTopUpAmount("");
    setTopUpErrors("");
  };

  const handleWithdrawCancel = () => {
    setShowWithdrawModal(false);
    setShowWithdrawConfirmation(false);
    setWithdrawAmount("");
    setWithdrawErrors("");
    setIsForceWithdraw(false);
  };

  // Refresh data
  const refreshData = async () => {
    if (!actor || !isAuthenticated || !principal) return;

    setIsLoading(true);
    try {
      const userSavingsData = await getUserSavings(actor, principal);
      const targetSaving = userSavingsData.find(
        (saving: Saving) => Number(saving.id) === Number(savingId)
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

  return {
    // State
    savingPlan,
    isLoading,
    error,
    showConfetti,

    // Top-up state
    showTopUpModal,
    topUpAmount,
    setTopUpAmount,
    showTopUpConfirmation,
    topUpErrors,
    isProcessingTopUp,

    // Withdraw state
    showWithdrawModal,
    withdrawAmount,
    setWithdrawAmount,
    showWithdrawConfirmation,
    withdrawErrors,
    isProcessingWithdraw,
    isForceWithdraw,

    // Handlers
    handleBack,
    handleTopUp,
    handleWithdraw,
    handleConfirmTopUp,
    handleConfirmWithdraw,
    handleFinalTopUpConfirm,
    handleFinalWithdrawConfirm,
    handleTopUpCancel,
    handleWithdrawCancel,
    refreshData,
  };
};
