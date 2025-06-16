// components/modals/SavingsPlanModals.tsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Loader,
  DollarSign,
  TrendingUp,
  Info,
  Shield,
  Clock,
  Minus,
  Plus
} from 'lucide-react';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { 
  WithdrawModalProps, 
  TopUpModalProps, 
  ConfirmationModalProps 
} from '@/types/savingsPlan';

// Modal Backdrop Component
const ModalBackdrop: React.FC<{
  children: React.ReactNode;
  onClose: () => void;
  isOpen: boolean;
}> = ({ children, onClose, isOpen }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Modal Container Component
const ModalContainer: React.FC<{
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
}> = ({ children, onClose, className = "" }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.9, opacity: 0 }}
    className={`relative bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-md ${className}`}
    onClick={(e) => e.stopPropagation()}
  >
    <button
      onClick={onClose}
      className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors duration-300 z-10"
    >
      <X size={20} />
    </button>
    {children}
  </motion.div>
);

// Amount Input Component
const AmountInput: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  max?: number;
  formatUSD?: (amount: number) => string;
  icon?: React.ReactNode;
  helper?: string;
}> = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  error, 
  max, 
  formatUSD, 
  icon,
  helper 
}) => (
  <div className="mb-6">
    <label className="block text-white/80 text-sm font-medium mb-3 flex items-center space-x-2">
      {icon}
      <span>{label}</span>
    </label>
    <div className="relative">
      <input
        type="number"
        step="0.01"
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300"
      />
    </div>
    {value && formatUSD && (
      <p className="text-white/40 text-sm mt-2">
        ≈ ${formatUSD(Number(value))} USD
      </p>
    )}
    {helper && !error && (
      <p className="text-white/50 text-xs mt-2">{helper}</p>
    )}
    {error && (
      <p className="text-red-400 text-sm mt-2">{error}</p>
    )}
  </div>
);

// Fee Breakdown Component
const FeeBreakdown: React.FC<{
  amount: string;
  isForceWithdraw: boolean;
  formatICP: (amount: number) => string;
  formatUSD: (amount: number) => string;
  calculateAdminFee: (amount: number, isForce: boolean) => number;
}> = ({ amount, isForceWithdraw, formatICP, formatUSD, calculateAdminFee }) => {
  if (!amount || Number(amount) <= 0) return null;

  const withdrawalAmount = Number(amount);
  const adminFee = calculateAdminFee(withdrawalAmount, isForceWithdraw);
  const netAmount = withdrawalAmount - adminFee;

  return (
    <div className="mt-3 p-4 bg-white/5 rounded-xl border border-white/10 space-y-3 text-sm">
      {/* Header */}
      <div className="flex items-center space-x-2 text-white/80 font-medium">
        <DollarSign size={16} />
        <span>Transaction Breakdown</span>
      </div>

      {/* Amount Details */}
      <div className="space-y-2">
        <div className="flex justify-between text-white/70">
          <span>Withdrawal Amount:</span>
          <span className="text-white font-medium">{amount} ICP</span>
        </div>
        
        <div className="flex justify-between text-white/70">
          <div className="flex items-center space-x-1">
            <span>Admin Fee ({isForceWithdraw ? "5%" : "2%"}):</span>
            {isForceWithdraw && (
              <AlertTriangle size={12} className="text-orange-400" />
            )}
          </div>
          <span className="text-red-400">
            -{formatICP(adminFee)} ICP
          </span>
        </div>

        {/* Net Amount */}
        <div className="border-t border-white/10 pt-2">
          <div className="flex justify-between text-white font-medium">
            <span>You&apos;ll Receive:</span>
            <span className="text-green-400">
              {formatICP(netAmount)} ICP
            </span>
          </div>
          <div className="flex justify-between text-white/50 text-xs mt-1">
            <span>≈ USD:</span>
            <span>${formatUSD(netAmount)}</span>
          </div>
        </div>
      </div>

      {/* Fee Explanation */}
      <div className="mt-3 p-3 bg-white/5 rounded-lg">
        <div className="flex items-start space-x-2">
          <Info size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-white/60">
            {isForceWithdraw ? (
              <span>
                Early withdrawal penalty applies because you&apos;re withdrawing before your target date. 
                The higher fee helps maintain the integrity of your savings plan.
              </span>
            ) : (
              <span>
                Standard admin fee covers transaction processing and platform maintenance.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick Amount Buttons Component
const QuickAmountButtons: React.FC<{
  maxAmount: number;
  onAmountSelect: (amount: string) => void;
  formatICP: (amount: number) => string;
}> = ({ maxAmount, onAmountSelect, formatICP }) => (
  <div className="mb-6">
    <p className="text-white/60 text-sm mb-3 flex items-center space-x-2">
      <TrendingUp size={14} />
      <span>Quick amounts:</span>
    </p>
    <div className="grid grid-cols-4 gap-2">
      {[
        { label: "25%", value: maxAmount * 0.25 },
        { label: "50%", value: maxAmount * 0.5 },
        { label: "75%", value: maxAmount * 0.75 },
        { label: "Max", value: maxAmount }
      ].map((option, index) => (
        <button
          key={index}
          onClick={() => onAmountSelect(option.value.toFixed(8))}
          className="bg-white/5 border border-white/10 rounded-lg py-2 px-1 text-white/80 text-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col items-center"
        >
          <span className="font-medium">{option.label}</span>
          <span className="text-xs text-white/50 mt-1">
            {formatICP(option.value)}
          </span>
        </button>
      ))}
    </div>
  </div>
);

// Warning Banner Component
const WarningBanner: React.FC<{
  type: 'warning' | 'info' | 'error';
  title: string;
  message: string;
  icon?: React.ReactNode;
}> = ({ type, title, message, icon }) => {
  const styles = {
    warning: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    info: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    error: "bg-red-500/10 border-red-500/20 text-red-400"
  };

  const defaultIcons = {
    warning: <AlertTriangle size={20} className="text-orange-400 flex-shrink-0 mt-0.5" />,
    info: <Info size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />,
    error: <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
  };

  return (
    <div className={`mb-6 p-4 border rounded-xl ${styles[type]}`}>
      <div className="flex items-start space-x-3">
        {icon || defaultIcons[type]}
        <div>
          <h4 className="font-medium text-sm mb-1">{title}</h4>
          <p className="text-xs opacity-80">{message}</p>
        </div>
      </div>
    </div>
  );
};

// Action Buttons Component
const ActionButtons: React.FC<{
  onCancel: () => void;
  onConfirm: () => void;
  confirmText: string;
  cancelText?: string;
  confirmBackground?: string;
  isDisabled?: boolean;
  confirmIcon?: React.ReactNode;
}> = ({ 
  onCancel, 
  onConfirm, 
  confirmText, 
  cancelText = "Cancel",
  confirmBackground = "rgba(255, 255, 255, 0.1)",
  isDisabled = false,
  confirmIcon
}) => (
  <div className="flex space-x-4">
    <button
      onClick={onCancel}
      className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 text-white/80 hover:bg-white/10 transition-all duration-300"
    >
      {cancelText}
    </button>
    <ShimmerButton
      className="flex-1 py-3"
      onClick={onConfirm}
      disabled={isDisabled}
      background={confirmBackground}
      shimmerColor="#ffffff"
      shimmerSize="0.1em"
    >
      <div className="flex items-center justify-center space-x-2">
        {confirmIcon}
        <span className="text-white">{confirmText}</span>
      </div>
    </ShimmerButton>
  </div>
);

// Top Up Modal Component
export const TopUpModal: React.FC<TopUpModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  topUpAmount,
  setTopUpAmount,
  topUpErrors,
  formatUSD
}) => (
  <ModalBackdrop isOpen={isOpen} onClose={onClose}>
    <ModalContainer onClose={onClose}>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Plus size={32} className="text-green-400" />
        </div>
        <h3 className="text-white text-2xl font-bold">Add to Savings</h3>
        <p className="text-white/60 text-sm mt-2">
          Boost your savings to reach your goal faster
        </p>
      </div>

      <AmountInput
        label="Amount to Transfer (ICP)"
        value={topUpAmount}
        onChange={setTopUpAmount}
        placeholder="8.04"
        error={topUpErrors}
        formatUSD={formatUSD}
        icon={<DollarSign size={16} />}
        helper="Add any amount to accelerate your progress"
      />

      {/* Benefits Info */}
      <div className="mb-6 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <TrendingUp size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-green-200">
            <strong>Pro tip:</strong> Additional contributions help you reach your goal ahead of schedule 
            and may increase your staking rewards if enabled.
          </div>
        </div>
      </div>

      <ActionButtons
        onCancel={onClose}
        onConfirm={() => onConfirm(topUpAmount)}
        confirmText="Continue"
        confirmBackground="rgba(34, 197, 94, 0.3)"
        confirmIcon={<Plus size={16} />}
        isDisabled={!topUpAmount || !!topUpErrors}
      />
    </ModalContainer>
  </ModalBackdrop>
);

// Withdraw Modal Component
export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  savingPlan,
  isForceWithdraw,
  withdrawAmount,
  setWithdrawAmount,
  withdrawErrors,
  calculateAdminFee,
  formatICP,
  formatUSD
}) => {
  if (!savingPlan) return null;

  return (
    <ModalBackdrop isOpen={isOpen} onClose={onClose}>
      <ModalContainer onClose={onClose} className="max-w-lg">
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
            isForceWithdraw 
              ? "bg-orange-500/20" 
              : "bg-blue-500/20"
          }`}>
            <Minus size={32} className={isForceWithdraw ? "text-orange-400" : "text-blue-400"} />
          </div>
          <h3 className="text-white text-2xl font-bold">
            {isForceWithdraw ? "Force Withdraw" : "Withdraw Funds"}
          </h3>
          <p className="text-white/60 text-sm mt-2">
            {isForceWithdraw 
              ? "Early withdrawal with penalty" 
              : "Normal withdrawal from your savings"
            }
          </p>
        </div>

        {/* Warning for force withdrawal */}
        {isForceWithdraw && (
          <WarningBanner
            type="warning"
            title="Early Withdrawal Penalty"
            message={`Withdrawing before ${savingPlan.targetDate} incurs a 5% admin fee instead of the normal 2% fee.`}
          />
        )}

        {/* Withdrawal Info Card */}
        <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/70 text-sm">Available Balance:</span>
            <span className="text-white font-semibold">
              {formatICP(savingPlan.currentSaved)} ICP
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-sm">≈ USD Value:</span>
            <span className="text-white/60">
              ${formatUSD(savingPlan.currentSaved)}
            </span>
          </div>
        </div>

        <AmountInput
          label="Amount to Withdraw (ICP)"
          value={withdrawAmount}
          onChange={setWithdrawAmount}
          placeholder={`Max: ${formatICP(savingPlan.currentSaved)}`}
          error={withdrawErrors}
          max={savingPlan.currentSaved}
          icon={<Minus size={16} />}
          helper="Enter the amount you wish to withdraw"
        />

        {/* Fee Breakdown */}
        <FeeBreakdown
          amount={withdrawAmount}
          isForceWithdraw={isForceWithdraw}
          formatICP={formatICP}
          formatUSD={formatUSD}
          calculateAdminFee={calculateAdminFee}
        />

        {/* Quick Amount Buttons */}
        <QuickAmountButtons
          maxAmount={savingPlan.currentSaved}
          onAmountSelect={setWithdrawAmount}
          formatICP={formatICP}
        />

        <ActionButtons
          onCancel={onClose}
          onConfirm={() => onConfirm(withdrawAmount)}
          confirmText={isForceWithdraw ? "Force Withdraw" : "Withdraw"}
          confirmBackground={
            isForceWithdraw
              ? "rgba(249, 115, 22, 0.3)"
              : "rgba(59, 130, 246, 0.3)"
          }
          confirmIcon={<Minus size={16} />}
          isDisabled={!withdrawAmount || !!withdrawErrors}
        />
      </ModalContainer>
    </ModalBackdrop>
  );
};

// Confirmation Modal Component
export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
  amount,
  type,
  isForceWithdraw = false,
  formatICP,
  formatUSD,
  calculateAdminFee
}) => {
  if (!isOpen) return null;

  const isWithdrawType = type === 'withdraw';
  const adminFee = isWithdrawType && calculateAdminFee 
    ? calculateAdminFee(Number(amount), isForceWithdraw)
    : 0;
  const netAmount = isWithdrawType ? Number(amount) - adminFee : Number(amount);

  return (
    <ModalBackdrop isOpen={isOpen} onClose={onClose}>
      <ModalContainer onClose={onClose} className="max-w-lg">
        <div className="text-center mb-6">
          {isProcessing ? (
            <div className="mb-4">
              <Loader size={48} className="text-white mx-auto mb-4 animate-spin" />
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock size={24} className="text-white/60" />
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                isWithdrawType
                  ? isForceWithdraw
                    ? "bg-orange-500/20"
                    : "bg-blue-500/20"
                  : "bg-green-500/20"
              }`}>
                {isWithdrawType && isForceWithdraw ? (
                  <AlertTriangle size={32} className="text-orange-400" />
                ) : (
                  <CheckCircle size={32} className={
                    isWithdrawType ? "text-blue-400" : "text-green-400"
                  } />
                )}
              </div>
            </div>
          )}

          <h3 className="text-white text-2xl font-bold mb-2">
            {isProcessing
              ? `Processing ${type === 'topup' ? 'Transfer' : 'Withdrawal'}...`
              : `Confirm ${type === 'topup' ? 'Transfer' : 'Withdrawal'}`}
          </h3>

          {isProcessing && (
            <p className="text-white/60 text-sm">
              Please wait while we process your transaction...
            </p>
          )}
        </div>

        {!isProcessing && (
          <div className="space-y-4">
            {isWithdrawType ? (
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
                {/* Transaction Summary Header */}
                <div className="flex items-center space-x-2 text-white/80 font-medium border-b border-white/10 pb-2">
                  <Shield size={16} />
                  <span>Transaction Summary</span>
                </div>

                {/* Amount Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/70">
                    <span>Withdrawal Amount:</span>
                    <span className="text-white font-medium">{amount} ICP</span>
                  </div>
                  
                  <div className="flex justify-between text-white/70">
                    <div className="flex items-center space-x-1">
                      <span>Admin Fee ({isForceWithdraw ? "5%" : "2%"}):</span>
                      {isForceWithdraw && (
                        <AlertTriangle size={12} className="text-orange-400" />
                      )}
                    </div>
                    <span className="text-red-400">
                      -{formatICP(adminFee)} ICP
                    </span>
                  </div>

                  {/* Net Amount */}
                  <div className="border-t border-white/10 pt-2 mt-3">
                    <div className="flex justify-between text-white font-medium text-base">
                      <span>You&apos;ll Receive:</span>
                      <span className="text-green-400">
                        {formatICP(netAmount)} ICP
                      </span>
                    </div>
                    <div className="flex justify-between text-white/50 text-xs mt-1">
                      <span>≈ USD:</span>
                      <span>${formatUSD(netAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                <p className="text-white/70 mb-2">
                  Transfer{" "}
                  <span className="text-white font-semibold text-lg">
                    {amount} ICP
                  </span>{" "}
                  to your savings plan?
                </p>
                <p className="text-white/50 text-sm">
                  ≈ ${formatUSD(Number(amount))} USD
                </p>
              </div>
            )}

            {/* Warning for early withdrawal */}
            {isWithdrawType && isForceWithdraw && (
              <WarningBanner
                type="warning"
                title="Early Withdrawal Penalty"
                message="Early withdrawal penalty applied due to withdrawal before target date"
              />
            )}

            {/* Security Notice */}
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="flex items-start space-x-2">
                <Shield size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-white/60">
                  <strong>Secure Transaction:</strong> This transaction is processed securely 
                  on the Internet Computer blockchain. All fees are transparent and clearly disclosed.
                </div>
              </div>
            </div>
          </div>
        )}

        {!isProcessing && (
          <div className="mt-6">
            <ActionButtons
              onCancel={onClose}
              onConfirm={onConfirm}
              confirmText={
                isWithdrawType
                  ? isForceWithdraw
                    ? "Confirm Force Withdrawal"
                    : "Confirm Withdrawal"
                  : "Confirm Transfer"
              }
              confirmBackground={
                isWithdrawType
                  ? isForceWithdraw
                    ? "rgba(249, 115, 22, 0.3)"
                    : "rgba(59, 130, 246, 0.3)"
                  : "rgba(34, 197, 94, 0.3)"
              }
              confirmIcon={
                isWithdrawType ? <Minus size={16} /> : <Plus size={16} />
              }
            />
          </div>
        )}
      </ModalContainer>
    </ModalBackdrop>
  );
};