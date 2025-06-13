import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE, Transaction__1 } from "./backend.did";

export const getAllTransactions = async (actor: ActorSubclass<_SERVICE>): Promise<Transaction__1[]> => {
  try {
    const result = await actor.getAllTransactions();
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
