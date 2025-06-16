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
} from "./backend.did";

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

// Get canister account ID
export const getCanisterAccountId = async (
  actor: ActorSubclass<_SERVICE>
): Promise<string> => {
  try {
    const result = await actor.getCanisterAccountId();
    return result;
  } catch (error) {
    console.error("Error getting canister account ID:", error);
    throw error;
  }
};

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
    // Convert string to Principal - you might need to import Principal from @dfinity/principal
    const { Principal } = await import("@dfinity/principal");
    const principalOwner = Principal.fromText(newOwner);
    const result = await actor.transferOwnership(principalOwner);
    return result;
  } catch (error) {
    console.error("Error transferring ownership:", error);
    throw error;
  }
};