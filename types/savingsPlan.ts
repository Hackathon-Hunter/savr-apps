export interface SavingPlanDetails {
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

export interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: string) => void;
  savingPlan: SavingPlanDetails | null;
  isForceWithdraw: boolean;
  withdrawAmount: string;
  setWithdrawAmount: (amount: string) => void;
  withdrawErrors: string;
  calculateAdminFee: (amount: number, isForce: boolean) => number;
  formatICP: (amount: number) => string;
  formatUSD: (amount: number) => string;
}

export interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: string) => void;
  topUpAmount: string;
  setTopUpAmount: (amount: string) => void;
  topUpErrors: string;
  formatUSD: (amount: number) => string;
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
  amount: string;
  type: "topup" | "withdraw";
  isForceWithdraw?: boolean;
  formatICP: (amount: number) => string;
  formatUSD: (amount: number) => string;
  calculateAdminFee?: (amount: number, isForce: boolean) => number;
}

export interface SavingsPlanHeaderProps {
  savingPlan: SavingPlanDetails;
  progressPercentage: number;
  isEligibleForNormalWithdraw: boolean;
  priceData: unknown;
}

export interface ProgressTrackerProps {
  savingPlan: SavingPlanDetails;
  progressPercentage: number;
  formatICP: (amount: number) => string;
  formatUSD: (amount: number) => string;
}

export interface ActionButtonsProps {
  onTopUp: () => void;
  onWithdraw: () => void;
  isEligibleForNormalWithdraw: boolean;
}

export interface SavingPlanConstants {
  NORMAL_ADMIN_FEE: number;
  PENALTY_ADMIN_FEE: number;
}
