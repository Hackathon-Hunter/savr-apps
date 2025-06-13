import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE, Saving__1, SavingResponse, StartSavingRequest, Transaction__1 } from "./backend.did";

export const getAllTransactions = async (
  actor: ActorSubclass<_SERVICE>
): Promise<Transaction__1[]> => {
  try {
    const result = await actor.getAllTransactions();
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getUserSavings = async (
  actor: ActorSubclass<_SERVICE>,
  principalId: string
): Promise<Saving__1[]> => {
  try {
    const result = await actor.getUserSavings(principalId);
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const startSaving = async (
  actor: ActorSubclass<_SERVICE>,
  args: StartSavingRequest
): Promise<SavingResponse> => {
  try {
    const result = await actor.startSaving(args);
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
