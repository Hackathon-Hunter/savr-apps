import { ActorSubclass } from "@dfinity/agent";
import {
  _SERVICE,
  Saving__1,
  SavingResponse,
  StartSavingRequest,
  Transaction__1,
  TopUpRequest,
  TransactionResponse,
  UpdateSavingRequest,
  SavingWithHistory,
  SavingId,
  ChatMessage,
  StakeICPRequest,
  StakeResponse,
  UnstakeRequest,
  UnstakeResponse,
  StakingInfo,
  StakingRewards,
  UserStakingStats,
  PlatformStakingStats,
} from "./backend.did";

// =============================================
// TRANSACTION MANAGEMENT
// =============================================

// Get all transactions
export const getAllTransactions = async (
  actor: ActorSubclass<_SERVICE>
): Promise<Transaction__1[]> => {
  try {
    const result = await actor.getAllTransactions();
    return result;
  } catch (error) {
    console.error("Error fetching all transactions:", error);
    throw error;
  }
};

// Get user transactions
export const getUserTransactions = async (
  actor: ActorSubclass<_SERVICE>,
  principalId: string
): Promise<Transaction__1[]> => {
  try {
    const result = await actor.getUserTransactions(principalId);
    return result;
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    throw error;
  }
};

// Get saving transactions
export const getSavingTransactions = async (
  actor: ActorSubclass<_SERVICE>,
  savingId: SavingId
): Promise<Transaction__1[]> => {
  try {
    const result = await actor.getSavingTransactions(savingId);
    return result;
  } catch (error) {
    console.error("Error fetching saving transactions:", error);
    throw error;
  }
};

// Get transaction detail
export const getTransactionDetail = async (
  actor: ActorSubclass<_SERVICE>,
  transactionId: bigint
): Promise<Transaction__1 | undefined> => {
  try {
    const result = await actor.getTransactionDetail(transactionId);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("Error fetching transaction detail:", error);
    throw error;
  }
};

// =============================================
// SAVINGS MANAGEMENT
// =============================================

// Get user savings
export const getUserSavings = async (
  actor: ActorSubclass<_SERVICE>,
  principalId: string
): Promise<Saving__1[]> => {
  try {
    const result = await actor.getUserSavings(principalId);
    return result;
  } catch (error) {
    console.error("Error fetching user savings:", error);
    throw error;
  }
};

// Get saving with history
export const getSavingWithHistory = async (
  actor: ActorSubclass<_SERVICE>,
  savingId: SavingId
): Promise<SavingWithHistory | undefined> => {
  try {
    const result = await actor.getSavingWithHistory(savingId);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("Error fetching saving with history:", error);
    throw error;
  }
};

// Start saving
export const startSaving = async (
  actor: ActorSubclass<_SERVICE>,
  args: StartSavingRequest
): Promise<SavingResponse> => {
  try {
    const result = await actor.startSaving(args);
    console.log("startSaving result:", result);
    return result;
  } catch (error) {
    console.error("Error creating saving plan:", error);

    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    throw error;
  }
};

// Top up saving
export const topUpSaving = async (
  actor: ActorSubclass<_SERVICE>,
  args: TopUpRequest
): Promise<TransactionResponse> => {
  try {
    const result = await actor.topUpSaving(args);
    console.log("topUpSaving result:", result);
    return result;
  } catch (error) {
    console.error("Error topping up saving:", error);
    throw error;
  }
};

// Update saving
export const updateSaving = async (
  actor: ActorSubclass<_SERVICE>,
  args: UpdateSavingRequest
): Promise<SavingResponse> => {
  try {
    const result = await actor.updateSaving(args);
    console.log("updateSaving result:", result);
    return result;
  } catch (error) {
    console.error("Error updating saving:", error);
    throw error;
  }
};

// Withdraw saving
export const withdrawSaving = async (
  actor: ActorSubclass<_SERVICE>,
  savingId: SavingId
): Promise<TransactionResponse> => {
  try {
    const result = await actor.withdrawSaving(savingId);
    console.log("withdrawSaving result:", result);
    return result;
  } catch (error) {
    console.error("Error withdrawing from saving:", error);
    throw error;
  }
};

// =============================================
// STAKING FUNCTIONALITY
// =============================================

// Stake ICP
export const stakeICP = async (
  actor: ActorSubclass<_SERVICE>,
  args: StakeICPRequest
): Promise<StakeResponse> => {
  try {
    const result = await actor.stakeICP(args);
    console.log("stakeICP result:", result);
    return result;
  } catch (error) {
    console.error("Error staking ICP:", error);
    throw error;
  }
};

// Unstake ICP
export const unstakeICP = async (
  actor: ActorSubclass<_SERVICE>,
  args: UnstakeRequest
): Promise<UnstakeResponse> => {
  try {
    const result = await actor.unstakeICP(args);
    console.log("unstakeICP result:", result);
    return result;
  } catch (error) {
    console.error("Error unstaking ICP:", error);
    throw error;
  }
};

// Get staking info for a saving
export const getStakingInfo = async (
  actor: ActorSubclass<_SERVICE>,
  savingId: SavingId
): Promise<StakingInfo | undefined> => {
  try {
    const result = await actor.getStakingInfo(savingId);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("Error fetching staking info:", error);
    throw error;
  }
};

// Get staking rewards for a saving
export const getStakingRewards = async (
  actor: ActorSubclass<_SERVICE>,
  savingId: SavingId
): Promise<StakingRewards | undefined> => {
  try {
    const result = await actor.getStakingRewards(savingId);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("Error fetching staking rewards:", error);
    throw error;
  }
};

// Claim staking rewards
export const claimStakingRewards = async (
  actor: ActorSubclass<_SERVICE>,
  savingId: SavingId,
  principalId: string
): Promise<TransactionResponse> => {
  try {
    const result = await actor.claimStakingRewards(savingId, principalId);
    console.log("claimStakingRewards result:", result);
    return result;
  } catch (error) {
    console.error("Error claiming staking rewards:", error);
    throw error;
  }
};

// Get user staking positions
export const getUserStakingPositions = async (
  actor: ActorSubclass<_SERVICE>,
  principalId: string
): Promise<[SavingId, StakingInfo][]> => {
  try {
    const result = await actor.getUserStakingPositions(principalId);
    return result;
  } catch (error) {
    console.error("Error fetching user staking positions:", error);
    throw error;
  }
};

// Get user staking stats
export const getUserStakingStats = async (
  actor: ActorSubclass<_SERVICE>,
  principalId: string
): Promise<UserStakingStats> => {
  try {
    const result = await actor.getUserStakingStats(principalId);
    return result;
  } catch (error) {
    console.error("Error fetching user staking stats:", error);
    throw error;
  }
};

// Get platform staking stats
export const getPlatformStakingStats = async (
  actor: ActorSubclass<_SERVICE>
): Promise<PlatformStakingStats> => {
  try {
    const result = await actor.getPlatformStakingStats();
    return result;
  } catch (error) {
    console.error("Error fetching platform staking stats:", error);
    throw error;
  }
};

// Calculate staking rewards
export const calculateStakingRewards = async (
  actor: ActorSubclass<_SERVICE>,
  stakeAmount: bigint,
  dissolveDelay: bigint,
  stakingDuration: bigint
): Promise<bigint> => {
  try {
    const result = await actor.calculateStakingRewards(
      stakeAmount,
      dissolveDelay,
      stakingDuration
    );
    return result;
  } catch (error) {
    console.error("Error calculating staking rewards:", error);
    throw error;
  }
};

// Update dissolve delay
export const updateDissolveDelay = async (
  actor: ActorSubclass<_SERVICE>,
  savingId: SavingId,
  newDissolveDelay: bigint,
  principalId: string
): Promise<boolean> => {
  try {
    const result = await actor.updateDissolveDelay(
      savingId,
      newDissolveDelay,
      principalId
    );
    console.log("updateDissolveDelay result:", result);
    return result;
  } catch (error) {
    console.error("Error updating dissolve delay:", error);
    throw error;
  }
};

// Force dissolve neuron
export const forceDissolveNeuron = async (
  actor: ActorSubclass<_SERVICE>,
  savingId: SavingId,
  neuronId: bigint
): Promise<boolean> => {
  try {
    const result = await actor.forceDissolveNeuron(savingId, neuronId);
    console.log("forceDissolveNeuron result:", result);
    return result;
  } catch (error) {
    console.error("Error force dissolving neuron:", error);
    throw error;
  }
};

// Follow neuron
export const followNeuron = async (
  actor: ActorSubclass<_SERVICE>,
  neuronId: bigint,
  followees: string[]
): Promise<boolean> => {
  try {
    // Convert string principals to Principal objects
    const { Principal } = await import("@dfinity/principal");
    const principalFollowees = followees.map((f) => Principal.fromText(f));

    const result = await actor.followNeuron(neuronId, principalFollowees);
    console.log("followNeuron result:", result);
    return result;
  } catch (error) {
    console.error("Error following neuron:", error);
    throw error;
  }
};

// Vote on proposal
export const voteOnProposal = async (
  actor: ActorSubclass<_SERVICE>,
  neuronId: bigint,
  proposalId: bigint,
  vote: boolean
): Promise<boolean> => {
  try {
    const result = await actor.voteOnProposal(neuronId, proposalId, vote);
    console.log("voteOnProposal result:", result);
    return result;
  } catch (error) {
    console.error("Error voting on proposal:", error);
    throw error;
  }
};

// Cleanup dissolved neurons
export const cleanupDissolvedNeurons = async (
  actor: ActorSubclass<_SERVICE>
): Promise<bigint> => {
  try {
    const result = await actor.cleanupDissolvedNeurons();
    console.log("cleanupDissolvedNeurons result:", result);
    return result;
  } catch (error) {
    console.error("Error cleaning up dissolved neurons:", error);
    throw error;
  }
};

// Get minimum stake amount
export const getMinimumStakeAmount = async (
  actor: ActorSubclass<_SERVICE>
): Promise<bigint> => {
  try {
    const result = await actor.getMinimumStakeAmount();
    return result;
  } catch (error) {
    console.error("Error fetching minimum stake amount:", error);
    throw error;
  }
};

// Get network APY
export const getNetworkAPY = async (
  actor: ActorSubclass<_SERVICE>
): Promise<number> => {
  try {
    const result = await actor.getNetworkAPY();
    return result;
  } catch (error) {
    console.error("Error fetching network APY:", error);
    throw error;
  }
};

// Check if staking is paused
export const isStakingPaused = async (
  actor: ActorSubclass<_SERVICE>
): Promise<boolean> => {
  try {
    const result = await actor.isStakingPaused();
    return result;
  } catch (error) {
    console.error("Error checking if staking is paused:", error);
    throw error;
  }
};

// =============================================
// AI CHAT FUNCTIONALITY
// =============================================

// Chat with AI
export const chat = async (
  actor: ActorSubclass<_SERVICE>,
  messages: ChatMessage[]
): Promise<string> => {
  try {
    const result = await actor.chat(messages);
    console.log("chat result:", result);
    return result;
  } catch (error) {
    console.error("Error chatting with AI:", error);
    throw error;
  }
};

// Simple prompt to AI
export const prompt = async (
  actor: ActorSubclass<_SERVICE>,
  message: string
): Promise<string> => {
  try {
    const result = await actor.prompt(message);
    console.log("prompt result:", result);
    return result;
  } catch (error) {
    console.error("Error sending prompt to AI:", error);
    throw error;
  }
};

// =============================================
// BALANCE AND ACCOUNT MANAGEMENT
// =============================================

// Get balance by principal
export const getBalanceByPrincipal = async (
  actor: ActorSubclass<_SERVICE>,
  principalId: string
): Promise<bigint> => {
  try {
    const result = await actor.getBalanceByPrincipal(principalId);
    return result;
  } catch (error) {
    console.error("Error fetching user balance:", error);
    throw error;
  }
};

// Get balance by account ID
export const getBalanceByAccountId = async (
  actor: ActorSubclass<_SERVICE>,
  accountId: string
): Promise<bigint> => {
  try {
    const result = await actor.getBalanceByAccountId(accountId);
    return result;
  } catch (error) {
    console.error("Error fetching balance by account ID:", error);
    throw error;
  }
};

// Get balance (for current canister)
export const getBalance = async (
  actor: ActorSubclass<_SERVICE>
): Promise<bigint> => {
  try {
    const result = await actor.getBalance();
    return result;
  } catch (error) {
    console.error("Error fetching canister balance:", error);
    throw error;
  }
};

// Get account ID from principal
export const getAccountIdFromPrincipal = async (
  actor: ActorSubclass<_SERVICE>,
  principalId: string
): Promise<string> => {
  try {
    const result = await actor.getAccountIdFromPrincipal(principalId);
    return result;
  } catch (error) {
    console.error("Error getting account ID from principal:", error);
    throw error;
  }
};

// =============================================
// CANISTER MANAGEMENT
// =============================================

// Get canister ID
export const getCanisterId = async (
  actor: ActorSubclass<_SERVICE>
): Promise<string> => {
  try {
    const result = await actor.getCanisterId();
    return result.toString();
  } catch (error) {
    console.error("Error getting canister ID:", error);
    throw error;
  }
};

// Get owner
export const getOwner = async (
  actor: ActorSubclass<_SERVICE>
): Promise<string> => {
  try {
    const result = await actor.getOwner();
    return result.toString();
  } catch (error) {
    console.error("Error getting owner:", error);
    throw error;
  }
};

// Transfer ownership
export const transferOwnership = async (
  actor: ActorSubclass<_SERVICE>,
  newOwner: string
): Promise<boolean> => {
  try {
    // Convert string to Principal
    const { Principal } = await import("@dfinity/principal");
    const principalOwner = Principal.fromText(newOwner);
    const result = await actor.transferOwnership(principalOwner);
    return result;
  } catch (error) {
    console.error("Error transferring ownership:", error);
    throw error;
  }
};

// =============================================
// ADMIN FUNCTIONS
// =============================================

// Pause staking
export const pauseStaking = async (
  actor: ActorSubclass<_SERVICE>
): Promise<boolean> => {
  try {
    const result = await actor.pauseStaking();
    console.log("pauseStaking result:", result);
    return result;
  } catch (error) {
    console.error("Error pausing staking:", error);
    throw error;
  }
};

// Resume staking
export const resumeStaking = async (
  actor: ActorSubclass<_SERVICE>
): Promise<boolean> => {
  try {
    const result = await actor.resumeStaking();
    console.log("resumeStaking result:", result);
    return result;
  } catch (error) {
    console.error("Error resuming staking:", error);
    throw error;
  }
};

// Migrate savings for staking
export const migrateSavingsForStaking = async (
  actor: ActorSubclass<_SERVICE>
): Promise<boolean> => {
  try {
    const result = await actor.migrateSavingsForStaking();
    console.log("migrateSavingsForStaking result:", result);
    return result;
  } catch (error) {
    console.error("Error migrating savings for staking:", error);
    throw error;
  }
};